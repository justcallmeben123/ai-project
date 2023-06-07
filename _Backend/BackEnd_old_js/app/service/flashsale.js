'use strict';

const Service = require('./base');

class FlashsaleService extends Service {
    // 获取有效秒杀信息
    async getFlashsale(id, type = 'course') {
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
                "id", "type", "goods_id", "price", "s_num", "used_num", "start_time", "end_time"
            ]
        }

        let s = await this.findOrFail('Flashsale', options, '秒杀不存在或已失效')

        if (s.used_num >= s.s_num) {
            ctx.throw(404, '该秒杀已被抢购完，等待下一场吧')
        }

        return s
    }

    // 获取秒杀产品信息（id，封面，标题，价格，类型）
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
                "id", "type", "price", "s_num", "used_num", "start_time", "end_time"
            ]
        }

        let s = await this.findOrFail('Flashsale', options, '秒杀不存在或已失效')

        if (s.used_num >= s.s_num) {
            ctx.throw(404, '该秒杀已被抢购完，等待下一场吧')
        }

        let c = s[s.type] || {}
        if (!c) {
            ctx.throw(404, '该秒杀已下架')
        }
        return {
            flashsale_id: id,
            id: c.id,
            title: c.title,
            cover: c.cover,
            price: s.price,
            type: s.type == 'column' ? 'column' : (c.type || 'null'),
            start_time: s.start_time,
            end_time: s.end_time
        }
    }
}

module.exports = FlashsaleService;