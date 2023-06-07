'use strict';

const Service = require('egg').Service;

class OrderService extends Service {
    // 查询课程/专栏/电子书ID是否存在
    async findGoodsByTypeAndId(goods_id, type, msg = '该商品不存在') {
        const { app, ctx, service } = this
        const school_id = ctx.currentSchool.id
        let goods = await app.model[ctx.firstToUpper(type)].findOne({
            where: {
                id: goods_id,
                school_id,
                status: 1
            }
        })
        if (!goods) ctx.throw(400, msg)
        return goods
    }
}

module.exports = OrderService;