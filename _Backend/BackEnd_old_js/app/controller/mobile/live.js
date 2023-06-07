'use strict';

const Controller = require('../base');

class LiveController extends Controller {
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
        }

        let res = await this.list(app.model.Live, {
            where,
            order: [
                ['id', 'DESC']
            ],
            attributes: ["cover", "end_time", "id", "price", "start_time", "sub_count", "t_price", "title"]
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows
        })
    }

    // 查看直播详情
    async read() {
        let { ctx, app, service } = this

        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: "直播ID"
            },
        })

        let { id } = ctx.query

        let school_id = ctx.currentSchool.id
        let where = {
            id,
            school_id,
        }

        let res = await this.findOne(app.model.Live, {
            where
        })

        res.isbuy = !!(await this.isbuy(id, 'live'))

        let status = service.live.getStatus(res)
        res.start_time = app.formatTime(res.start_time)
        res.end_time = app.formatTime(res.end_time)

        let result = {}
        if (status == "直播中" && res.isbuy) {
            result = service.live.getPushAndPlayUrl(res.key, res.end_time)
        } else {
            delete res.key
        }

        ctx.apiSuccess({
            ...res,
            status,
            playUrl: result.playUrl
        })
    }

}

module.exports = LiveController;