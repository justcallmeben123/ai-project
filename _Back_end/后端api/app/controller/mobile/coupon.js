'use strict';

const Controller = require('../base');

class CouponController extends Controller {
    //   可使用优惠券列表
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        let where = {
            school_id: ctx.currentSchool.id,
            status: 1,
            start_time: {
                [Op.lt]: new Date(),
            },
            end_time: {
                [Op.gt]: new Date(),
            }
        }

        let include = [{
                model: app.model.Course,
                attributes: ['id', 'title']
            }, {
                model: app.model.Column,
                attributes: ['id', 'title']
            }]
            // 已登陆
        if (ctx.authUser) {
            include.push({
                model: app.model.UserCoupon,
                where: {
                    user_id: ctx.authUser.id
                },
                attributes: ['id'],
                required: false
            })
        }

        let res = await this.list(app.model.Coupon, {
            where,
            attributes: [
                "id", "type", "goods_id", "price", "c_num", "received_num", "start_time", "end_time"
            ],
            include,
            order: [
                ['id', 'DESC']
            ]
        })

        ctx.apiSuccess(res.rows.map(item => {
            let c = item[item.type] || {}
            item.value = {
                id: c.id || 'null',
                title: c.title || 'null',
            }
            item.isgetcoupon = item.user_coupons ? !!item.user_coupons.length : false
            delete item.user_coupons
            delete item.course
            delete item.column
            return item
        }))
    }
}

module.exports = CouponController;