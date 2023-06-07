'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
    // 查
    async list(model, options = {}, validate = {}) {
        let { ctx, app, service } = this;
        ctx.validate({
            ...validate,
            page: {
                required: false,
                desc: "页码",
                type: "int"
            },
            limit: {
                required: false,
                type: "int",
                defValue: 10
            }
        });
        // 分页
        let rows = await this.page(model, options)
        return app.toArray(rows)
    }

    // 分页
    async page(model, options) {
        let { ctx, app, service } = this;
        let page = ctx.query.page ? parseInt(ctx.query.page) : 1;
        let limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;
        let offset = (page - 1) * limit;

        return await model.findAndCountAll({
            offset,
            limit,
            ...options,
            distinct: true
        });
    }

    // 查询单条数据
    async findOne(model, options = {}, validate = {}) {
        let { ctx, app, service } = this;
        ctx.validate({
            id: {
                required: true,
                desc: "ID",
                type: "int"
            },
            ...validate,
        })

        let res = await model.findOne({
            ...options,
        })

        if (!res) {
            ctx.throw(404, '该记录不存在')
        }

        return app.toArray(res)
    }

    // 是否购买了当前课程
    async isbuy(goods_id, type = 'course') {
        const { ctx, app } = this

        const school_id = ctx.currentSchool.id
        const Op = app.Sequelize.Op
        if (!ctx.authUser) {
            return false
        }
        const user_id = ctx.authUser.id
        let include = [{
            model: app.model.Order,
            where: {
                [Op.or]: {
                    status: {
                        [Op.in]: ["success"]
                    },
                    pay_method: "free"
                }
            },
            required: true
        }]
        return await app.model.OrderItem.findOne({
            where: {
                school_id,
                user_id,
                type,
                goods_id
            },
            include,
            attributes: ['id', 'goods_id', 'type', 'order_id']
        })
    }

    // 是否已收藏
    async isfava(goods_id, type = 'course') {
        const { ctx, app } = this
        const school_id = ctx.currentSchool.id
        if (!ctx.authUser) {
            return false
        }
        const user_id = ctx.authUser.id
        return await app.model.UserFava.findOne({
            where: {
                school_id,
                user_id,
                goods_id,
                type
            }
        })
    }

}

module.exports = BaseController;