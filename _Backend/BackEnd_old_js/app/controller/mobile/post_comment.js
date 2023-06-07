'use strict';

const Controller = require('../base');

class Post_commentController extends Controller {
    async index() {
        const { ctx, app } = this

        ctx.validate({
            post_id: {
                type: "int",
                required: true,
                desc: "帖子ID"
            }
        })

        const { post_id } = ctx.query
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            post_id,
            reply_id: 0
        }

        let res = await this.list(app.model.PostComment, {
            where,
            attributes: {
                exclude: ["updated_time", "school_id", "post_id"]
            },
            include: [{
                model: app.model.User,
                attributes: ['id', 'username', 'avatar', 'nickname', 'phone']
            }, {
                model: app.model.PostComment,
                attributes: {
                    exclude: ["updated_time", "school_id", "post_id"]
                },
                include: [{
                    model: app.model.User,
                    attributes: ['id', 'username', 'avatar', 'nickname', 'phone']
                }]
            }],
            order: [
                ['is_top', 'DESC'],
                ['id', 'DESC']
            ]
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {

                let r = {
                    id: item.id,
                    content: item.content,
                    reply_id: item.reply_id,
                    reply_user: item.reply_user,
                    is_top: item.is_top,
                    created_time: item.created_time,
                    user: {
                        id: item.user.id,
                        name: item.user.nickname || item.user.username || item.user.phone,
                        avatar: item.user.avatar
                    },
                }

                r.post_comments = item.post_comments.map(o => {
                    return {
                        id: o.id,
                        content: o.content,
                        reply_id: o.reply_id,
                        reply_user: o.reply_user ? JSON.parse(o.reply_user) : null,
                        is_top: o.is_top,
                        created_time: o.created_time,
                        user: {
                            id: o.user.id,
                            name: o.user.nickname || o.user.username || o.user.phone,
                            avatar: o.user.avatar
                        },
                    }
                })

                return r
            }),
        })
    }

    // 帖子评论/回复
    async save() {
        const { ctx, app } = this

        ctx.validate({
            post_id: {
                type: "int",
                required: true,
                desc: "帖子ID"
            },
            content: {
                type: "string",
                required: true,
                desc: "回复内容"
            },
            reply_id: {
                type: "int",
                required: true,
                desc: "回复ID"
            },
            reply_user: {
                type: "json",
                required: false,
                desc: "回复对象"
            },
        })


        let {
            post_id,
            content,
            reply_id,
            reply_user
        } = ctx.request.body
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id

        if (reply_user) {
            ["id", "username", "avatar"].forEach(k => {
                if (!reply_user.hasOwnProperty(k)) {
                    ctx.throw(400, `reply_user对象中必须包含${k}`)
                }
            })
        }

        // post_id是否存在
        let p = await app.model.Post.findOne({
            where: {
                id: post_id,
                school_id
            }
        })
        if (!p) {
            ctx.throw(400, '帖子ID不存在')
        }

        // reply_id是否存在
        if (reply_id != 0 && !(await app.model.PostComment.findOne({
                where: {
                    school_id,
                    id: reply_id,
                    post_id
                }
            }))) {
            ctx.throw(400, '回复的评论ID不存在')
        }
        let c = await app.model.PostComment.create({
            school_id,
            post_id,
            reply_id,
            content,
            user_id,
            reply_user: reply_user ? JSON.stringify(reply_user) : null,
            is_top: 0
        })
        if (c) {

            // 评论数+1
            await p.increment({ comment_count: 1 })

            return ctx.apiSuccess(c)
        }

        ctx.throw(400, '发表评论失败')
    }

}

module.exports = Post_commentController;