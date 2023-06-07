'use strict';

const Controller = require('../base');

class User_couponController extends Controller {
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            user_id: ctx.authUser.id,
        }

        let { goods_id, type } = ctx.request.query
        let couponWhere = {}
        if (goods_id && type) {
            couponWhere = {
                goods_id: parseInt(goods_id),
                type
            }
        }

        let res = await this.list(app.model.UserCoupon, {
            where,
            include: [{
                model: app.model.Coupon,
                attributes: [
                    "id", "type", "goods_id", "price", "start_time", "end_time"
                ],
                where: couponWhere,
                required: true,
                include: [{
                    model: app.model.Course,
                    attributes: ['id', 'title']
                }, {
                    model: app.model.Column,
                    attributes: ['id', 'title']
                }],
            }],
            attributes: ['id', 'used'],
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                let coupon = item.coupon
                let c = coupon[coupon.type] || {}
                return {
                    id: item.id,
                    price: coupon.price,
                    start_time: app.formatTime(coupon.start_time),
                    end_time: app.formatTime(coupon.end_time),
                    type: coupon.type,
                    used: item.used,
                    title: c.title || 'null',
                    goods_id: coupon.goods_id
                }
            })
        })
    }

    // 领取优惠券
    async save() {
        let { ctx, app } = this;
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id;

        ctx.validate({
            coupon_id: {
                type: "int",
                required: true,
                desc: "优惠券ID"
            },
        })

        const { coupon_id } = ctx.request.body

        // 优惠券是否存在
        let c = await app.model.Coupon.findOne({
            where: {
                school_id,
                id: coupon_id,
                status: 1
            }
        })
        if (!c) {
            ctx.throw(400, '该优惠券不存在')
        }
        if (c.received_num >= c.c_num) {
            ctx.throw(400, '该优惠券已被领完')
        }

        // 已领取
        let where = {
            school_id,
            user_id,
            coupon_id,
        }
        let user_coupon = await app.model.UserCoupon.findOne({
            where
        })
        if (user_coupon) {
            ctx.throw(400, '你已经领取过了')
        }

        let res = await app.model.UserCoupon.create(where)

        if (res) {
            // 更新被领取数
            c.received_num = c.received_num + 1
            await c.save()
        }

        ctx.apiSuccess('ok');
    }

    // 获取用户可用优惠券量
    async count() {
        const { ctx, app } = this

        ctx.validate({
            goods_id: {
                type: "int",
                required: true,
                desc: "课程/专栏ID"
            },
            type: {
                type: "string",
                required: true,
                range: { in: ['course', 'column']
                },
                desc: "类型"
            },
        })

        const { goods_id, type } = ctx.query

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            user_id: ctx.authUser.id,
            used: 0,
        }

        let res = await app.model.UserCoupon.count({
            where,
            include: [{
                model: app.model.Coupon,
                where: {
                    status: 1,
                    goods_id,
                    type,
                    school_id,
                    start_time: {
                        [Op.lt]: new Date(),
                    },
                    end_time: {
                        [Op.gt]: new Date(),
                    }
                },
                required: true,
            }],
        })

        ctx.apiSuccess(res)
    }
}

module.exports = User_couponController;