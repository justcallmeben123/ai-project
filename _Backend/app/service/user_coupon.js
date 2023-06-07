'use strict';

const Service = require('egg').Service;

class User_couponService extends Service {
    // 获取优惠券金额
    async getCouponPrice(id, goods_id, type = 'course', transaction = null) {
        const { ctx, app } = this;
        let user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id

        // 是否存在
        let userCoupon = await app.model.UserCoupon.findOne({
            where: {
                id,
                school_id,
                user_id,
            },
            attributes: ['id', 'used'],
            include: [{
                model: app.model.Coupon,
                where: {
                    status: 1,
                },
                required: true,
                attributes: ['id', 'goods_id', 'type', 'end_time', 'start_time', 'price', 'used_num']
            }]
        })

        if (!userCoupon) {
            ctx.throw(400, '该用户优惠券ID不存在')
        }
        if (userCoupon.used) {
            ctx.throw(400, '该优惠券已被使用过了')
        }

        let c = userCoupon.coupon
            // console.log(c)

        // 验证使用范围
        if (c.goods_id != goods_id || c.type != type) {
            ctx.throw(400, '该优惠券不能适用该订单')
        }
        // 验证使用时间
        const now = (new Date()).getTime()
        if ((new Date(c.end_time)).getTime() < now) {
            ctx.throw(400, '该优惠券已过期')
        }
        if ((new Date(c.start_time)).getTime() > now) {
            ctx.throw(400, '该优惠券还未开始发放')
        }

        // 切换用户优惠券使用状态
        userCoupon.used = 1
        await userCoupon.save({ transaction })

        // 优惠券被使用数+1
        c.used_num = c.used_num + 1
        await c.save({ transaction })

        return c.price
    }

}

module.exports = User_couponService;