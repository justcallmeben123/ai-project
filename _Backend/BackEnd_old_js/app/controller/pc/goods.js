'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {
    // 获取产品信息
    async read() {
        const { ctx, app, service } = this
        const t = {
            course: "课程",
            column: "专栏",
            book: "电子书",
            flashsale: "秒杀",
            group: "拼团",
            live:"直播"
        }

        ctx.validate({
            type: {
                required: true,
                type: "string",
                range: { in: ['course', 'column', 'book', 'flashsale', 'group',"live"]
                },
                desc: "类型"
            },
            id: {
                required: true,
                type: "int",
                desc: t[ctx.query.type] + "ID"
            },
        })

        const { id, type } = ctx.query

        ctx.apiSuccess(await service[type].getGoodsInfo(id))

    }
}

module.exports = GoodsController;