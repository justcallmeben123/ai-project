'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
    async echo() {
        let { ctx, app } = this

        let res = await this.getData()

        ctx.body = res
    }

    async getData() {
        let { ctx, app } = this

        let type = (ctx.query.type && ctx.query.type != '') ? ctx.query.type : 'province'

        let m = {
            province: 'States',
            city: "Cities",
            area: "CitiesExtended"
        }

        let modelName = m[type]

        if (!modelName) {
            return []
        }

        let where = {}

        let k = {
            province: 'state_code',
            city: "state_code",
            area: "city"
        }

        if (ctx.query.keyword && ctx.query.keyword != '' && ctx.query.keyword != undefined) {
            where[k[type]] = ctx.query.keyword
        }

        let page = ctx.query.page ? parseInt(ctx.query.page) : 1;
        let limit = 10;
        let offset = (page - 1) * limit;

        return await app.model[modelName].findAll({
            where,
            offset,
            limit
        })
    }
}

module.exports = TestController;