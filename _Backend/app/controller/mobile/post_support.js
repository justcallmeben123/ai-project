'use strict';

const Controller = require('../base');

class Post_supportController extends Controller {
    // 点赞
    async save() {
        const { ctx, app } = this

        ctx.validate({
            post_id: {
                type: "int",
                required: true,
                desc: '帖子ID'
            },
        })

        const school_id = ctx.currentSchool.id
        let { post_id } = ctx.request.body

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

        const user_id = ctx.authUser.id
        const where = {
            post_id,
            user_id
        }
        let s = await app.model.PostSupport.findOne({ where })

        if (s) {
            ctx.throw(400, '你已经点赞过了')
        }
        // 点赞
        await app.model.PostSupport.create(where)

        // 点赞数+1
        await p.increment({ support_count: 1 })
        ctx.apiSuccess('ok')
    }

    // 取消点赞
    async delete() {
        const { ctx, app } = this

        ctx.validate({
            post_id: {
                type: "int",
                required: true,
                desc: '帖子ID'
            },
        })

        const school_id = ctx.currentSchool.id
        let { post_id } = ctx.request.body

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

        const user_id = ctx.authUser.id
        const where = {
            post_id,
            user_id
        }
        let s = await app.model.PostSupport.findOne({ where })

        if (!s) {
            ctx.throw(400, '你没有点赞过')
        }
        // 取消点赞
        await s.destroy()

        // 点赞数-1
        await p.decrement({ support_count: 1 })
        ctx.apiSuccess('ok')
    }
}

module.exports = Post_supportController;