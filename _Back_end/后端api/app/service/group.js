'use strict';

const Service = require('./base');

class GroupService extends Service {
    // 获取有效拼团信息
    async getGroup(id, type = 'course') {
        const { ctx, app } = this
        const school_id = ctx.currentSchool.id
        const Op = app.Sequelize.Op
        const now = new Date()
        let where = {
            school_id,
            id,
            status: 1,
            start_time: {
                [Op.lt]: now,
            },
            end_time: {
                [Op.gt]: now,
            }
        }

        if (type) {
            where.type = type
        }

        const options = {
            where,
            attributes: [
                "id", "type", "goods_id", "price", "p_num", "start_time", "end_time"
            ]
        }
        let g = await this.findOrFail('Group', options, '拼团不存在或已失效')

        return app.toArray(g)
    }

    // 获取拼团产品信息（id，封面，标题，价格，类型）
    async getGoodsInfo(id) {
        const { ctx, app } = this
        const school_id = ctx.currentSchool.id
        const Op = app.Sequelize.Op
        const now = new Date()
        const options = {
            where: {
                school_id,
                id,
                status: 1,
                start_time: {
                    [Op.lt]: now,
                },
                end_time: {
                    [Op.gt]: now,
                }
            },
            include: [{
                model: app.model.Course,
                attributes: ['id', 'title', 'price', 'type', 'cover'],
            }, {
                model: app.model.Column,
                attributes: ['id', 'title', 'price', 'cover'],
            }],
            attributes: [
                "id", "type", "price", "p_num", "start_time", "end_time"
            ]
        }
        let g = await this.findOrFail('Group', options, '拼团不存在或已失效')

        let c = g[g.type] || {}
        if (!c) {
            ctx.throw(404, '该拼团已下架')
        }
        return {
            group_id: id,
            id: c.id,
            title: c.title,
            cover: c.cover,
            price: g.price,
            type: g.type == 'column' ? 'column' : (c.type || 'null'),
            start_time: g.start_time,
            end_time: g.end_time
        }
    }
}

module.exports = GroupService;