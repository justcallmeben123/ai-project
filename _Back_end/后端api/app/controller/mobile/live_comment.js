'use strict';

const Controller = require('../base');

class Live_commentController extends Controller {
    async index() {
        const { ctx, app } = this

        ctx.validate({
            live_id: {
                type: "int",
                required: true,
                desc: "直播间ID"
            }
        })

        const { live_id } = ctx.query
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            live_id,
        }

        let res = await this.list(app.model.LiveComment, {
            where,
            attributes: {
                exclude: ["updated_time", "school_id", "live_id"]
            },
            include: [{
                model: app.model.User,
                attributes: ['id', 'username', 'nickname', 'phone']
            }],
            order: [
                ['time', 'ASC'],
                ['created_time', 'ASC']
            ]
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                return {
                    id: item.id,
                    name: item.user.nickname || item.user.username || item.user.phone,
                    content: item.content,
                    color: item.color,
                    time: item.time,
                }
            }),
        })
    }

    // 发表弹幕
    async save() {
        const { ctx, app, service } = this

        ctx.validate({
            live_id: {
                type: "int",
                required: true,
                desc: "直播ID"
            },
            content: {
                type: "string",
                required: true,
                desc: "弹幕内容"
            },
            time: {
                type: "int",
                required: true,
                desc: "弹幕时间"
            },
            color: {
                type: "string",
                required: true,
                desc: "弹幕颜色"
            },
        })


        let {
            live_id,
            content,
            time,
            color
        } = ctx.request.body
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id

        // live_id是否存在
        let p = await app.model.Live.findOne({
            where: {
                id: live_id,
                school_id
            }
        })
        if (!p) {
            ctx.throw(400, '直播间ID不存在')
        }

        let status = service.live.getStatus(p)
        if (status != '直播中') {
            ctx.throw(400, '当前直播间状态不是直播中')
        }

        let c = await app.model.LiveComment.create({
            school_id,
            live_id,
            content,
            user_id,
            time,
            color
        })
        if (c) {
            return ctx.apiSuccess({
                id: c.id,
                name: ctx.authUser.nickname || ctx.authUser.username || ctx.authUser.phone,
                content: c.content,
                color: c.color,
                time: c.time,
            })
        }

        ctx.throw(400, '发表弹幕失败')
    }
}

module.exports = Live_commentController;