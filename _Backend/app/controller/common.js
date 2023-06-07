'use strict';

const Controller = require('egg').Controller;

class CommonController extends Controller {
    // 店铺地址
    async school() {
        const { ctx, app } = this

        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: "网校id"
            }
        })

        let id = ctx.params.id

        let res = await app.model.School.findOne({
            where: {
                id
            },
            attributes: ['name']
        })

        ctx.body = `这是 "${res.name}" 的网校店铺地址`
    }
}

module.exports = CommonController;