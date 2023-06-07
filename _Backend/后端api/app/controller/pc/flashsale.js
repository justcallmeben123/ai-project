'use strict';

const Controller = require('../base');

class FlashsaleController extends Controller {
    //   可使用秒杀列表
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        let where = {
            school_id: ctx.currentSchool.id,
            status: 1,
        }

        if (ctx.query.usable == 1) {
            let Op = app.Sequelize.Op
            where.start_time = {
                [Op.lt]: new Date(),
            }
            where.end_time = {
                [Op.gt]: new Date(),
            }
        }

        let res = await this.list(app.model.Flashsale, {
            where,
            attributes: [
                "id", "type", "goods_id", "price", "s_num", "used_num", "start_time", "end_time"
            ],
            include: [{
                model: app.model.Course,
                attributes: ['id', 'title', 'price', 'type', 'cover'],
            }, {
                model: app.model.Column,
                attributes: ['id', 'title', 'price', 'cover'],
            }],
            order: [
                ['id', 'DESC']
            ]
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                let c = item[item.type] || {}
                return {
                    flashsale_id: item.id,
                    id: item.goods_id,
                    title: c.title || 'null',
                    cover: c.cover || 'null',
                    price: item.price,
                    t_price: c.price || 'null',
                    type: item.type == 'column' ? item.type : (c.type || 'null'),
                    start_time: item.start_time,
                    end_time: item.end_time,
                    s_num: item.s_num,
                    used_num: item.used_num,
                }
            })
        })
    }
}

module.exports = FlashsaleController;