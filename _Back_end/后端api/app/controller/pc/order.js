'use strict';
// const WxPay = require('wxpay-slim');
const Controller = require('../base');
class OrderController extends Controller {
    // 我的订单列表
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            user_id: ctx.authUser.id,
        }

        let res = await this.list(app.model.Order, {
            where,
            // attributes: [
            //     "id", "type", "goods_id", "price", "start_time", "end_time"
            // ],
            include: [{
                model: app.model.OrderItem,
                where: {
                    school_id
                },
                attributes: ['id', 'type'],
                include: [{
                    model: app.model.Course,
                    attributes: ['title', 'type'],
                }, {
                    model: app.model.Column,
                    attributes: ['title'],
                }, {
                    model: app.model.Book,
                    attributes: ['title'],
                }, {
                    model: app.model.Live,
                    attributes: ['title'],
                }],
            }],
            attributes: ['id', 'no', 'price', 'status', 'total_price', 'created_time', 'type'],
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                item.goods = item.order_items.map(o => {
                    let c = o[o.type]

                    let type = o.type == 'course' ? (c ? c.type : 'null') : o.type
                    let obj = {
                        column: "专栏",
                        media: "图文",
                        audio: "音频",
                        video: "视频",
                        book: "电子书",
                        live: "直播"
                    }
                    return c ? `[${obj[type]}]${ c ? c.title : null}` : '课程已删除'
                }).join(',')
                item.created_time = app.formatTime(item.created_time)
                delete item.order_items
                return item
            })
        })
    }

    // 创建订单
    async save() {
        const { ctx, app, service } = this;
        let user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id

        let { type, goods_id, user_coupon_id } = ctx.request.body
        let goodsIdDesc = '课程ID'
        if (type) {
            let d = {
                book: "电子书ID",
                course: "课程ID",
                column: "专栏ID",
                live: "直播ID"
            }
            goodsIdDesc = d[type]
        }

        ctx.validate({
            goods_id: {
                type: "int",
                required: true,
                desc: goodsIdDesc
            },
            type: {
                type: "string",
                required: true,
                range: { in: ['book', 'course', 'column', "live"]
                },
                desc: "类型"
            },
            user_coupon_id: {
                type: "int",
                required: false,
                desc: '用户优惠券ID'
            },
        })

        // 查询课程/专栏/电子书ID是否存在
        let goods = await service.order.findGoodsByTypeAndId(goods_id, type, goodsIdDesc + '不存在')

        if (goods.price == 0) {
            ctx.throw(400, '该' + goodsIdDesc + '免费，无需下单购买')
        }

        // 是否已经购买过该课程/专栏/电子书
        if (!!(await this.isbuy(goods_id, type))) {
            ctx.throw(400, '你之前已经购买过啦，请勿重复下单')
        }

        let transaction;
        let price = goods.price
        let no = ctx.createOrderNo()
        try {
            // 建立事务对象
            transaction = await app.model.transaction();
            // 获取优惠券价格
            let couponPrice = 0
            if (user_coupon_id) {
                couponPrice = await service.userCoupon.getCouponPrice(user_coupon_id, goods_id, type, transaction)
            }
            // 商品价格计算
            price = price - couponPrice
            price = price < 0 ? 0 : price

            // 创建订单
            let order = await app.model.Order.create({
                school_id,
                user_id,
                no,
                status: "pendding",
                price,
                total_price: goods.price,
                type: 'default',
            }, { transaction })

            if (!order) ctx.throw(400, '创建订单失败')

            // 创建子订单
            let orderItem = await app.model.OrderItem.create({
                goods_id,
                type: ['media', 'audio', 'video', 'course'].includes(type) ? 'course' : type,
                school_id,
                order_id: order.id,
                user_id,
            }, { transaction })

            if (!orderItem) ctx.throw(400, '创建子订单失败')

            // 提交事务
            await transaction.commit();

            // 开启自动关闭订单延迟队列
            await service.queue.addAutoCloseOrderTask(order.id)

            ctx.apiSuccess(order);
        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            ctx.throw(400, err.message)
        }

    }

    // 微信PC扫码支付
    async wxpay() {
        const { ctx, app } = this;
        let user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id
        let rules = {
            no: {
                type: "string",
                required: true,
                desc: "订单号"
            },
        }

        ctx.validate(rules)
        let { no } = ctx.request.body

        let order = await app.model.Order.findOne({
            where: {
                no,
                user_id,
                school_id
            },
            attributes: ["id", "no", "status", "price", "wxpay_code_url"]
        })

        if (!order) {
            ctx.throw(400, '该订单不存在')
        }

        if (order.status == 'success') {
            ctx.throw(400, '该订单已经付过款了')
        }
        if (order.status != 'pendding') {
            ctx.throw(400, '该订单状态错误')
        }

        let result = {}

        try {
            app.tenpay.appid = this.app.config.H5Weixin.appid
            result = await app.tenpay.unifiedOrder({
                out_trade_no: order.no,
                body: '课程订单号：' + order.no,
                total_fee: parseInt(order.price * 100),
                trade_type: "NATIVE",
                notify_url: app.config.webUrl + '/order/notify',
            });

            // 更新二维码
            if (result.return_code == 'SUCCESS') {
                order.wxpay_code_url = result.code_url
                await order.save()
            }

        } catch (error) {
            // console.log(error.message == 'INVALID_REQUEST')
            // console.log(order.wxpay_code_url)
            if (error.message == 'INVALID_REQUEST' && order.wxpay_code_url) {
                result.code_url = order.wxpay_code_url
                result.return_code = 'SUCCESS'
            }
        }

        if (result.return_code != 'SUCCESS') {
            ctx.throw(400, '发起支付失败')
        }

        ctx.apiSuccess({
            code_url: result.code_url,
            price: order.price
        })
    }

    // 查询用户是否已支付
    async iswxpay() {
        const { ctx, app } = this;
        let rules = {
            no: {
                type: "string",
                required: true,
                desc: "订单号"
            },
        }

        ctx.validate(rules)
        let { no } = ctx.request.body
        app.tenpay.appid = this.app.config.H5Weixin.appid
        let { trade_state } = await app.tenpay.orderQuery({
            out_trade_no: no
        });

        // NOTPAY代表未支付,SUCCESS为支付成功
        ctx.apiSuccess({
            trade_state
        })
    }

    // 支付回调
    async notify() {
        const { ctx, app, service } = this;
        let info = ctx.request.weixin;
        console.log(info)
            /**
            {
              appid: 'wxf0d97abcc66aab61',
              bank_type: 'OTHERS',
              cash_fee: '10',
              fee_type: 'CNY',
              is_subscribe: 'Y',
              mch_id: '1554008981',
              nonce_str: 'ZVj9kT7n4kGjogxq',
              openid: 'oW6QU1pT9tyg_9twte1JDZvbZLMA',
              out_trade_no: '202191020272uigr2g5y8',
              result_code: 'SUCCESS',
              return_code: 'SUCCESS',
              sign: '15EFD81CA43D0A029800BEF6264456FB',
              time_end: '20210910203652',
              total_fee: '10',
              trade_type: 'NATIVE',
              transaction_id: '4200001234202109109016398483'
            }
            **/
        if (!info || info.result_code !== 'SUCCESS') {
            return ctx.reply('支付失败');
        }

        // 查询当前订单
        let order = await app.model.Order.findOne({
            where: {
                no: info.out_trade_no,
                status: "pendding"
            },
            include: [{
                model: app.model.OrderItem,
                attributes: ['goods_id', 'type']
            }]
        })

        if (!order) {
            return ctx.reply('订单不存在');
        }

        // 是否是拼团订单
        let isGroupOrder = order.type == 'group' && order.group_work_id

        // 是否关闭拼团任务
        let isCloseGroupTask = false

        let transaction;
        try {
            // 建立事务对象
            transaction = await app.model.transaction();

            // 修改订单状态
            order.status = isGroupOrder ? 'grouping' : 'success'
            order.pay_method = 'wechat'
            order.pay_time = new Date()
            await order.save({ transaction })

            // 修改课程订阅数
            order = app.toArray(order)

            for (let i = 0; i < order.order_items.length; i++) {
                let o = order.order_items[i]
                let goods = await app.model[ctx.firstToUpper(o.type)].findOne({
                    where: {
                        id: o.goods_id,
                    },
                    attributes: ['id', 'sub_count']
                })
                if (goods) {
                    goods.sub_count = goods.sub_count + 1
                    await goods.save({ transaction })
                }
            }

            // 修改拼团状态
            if (isGroupOrder) {
                let gw = await app.model.GroupWork.findOne({
                    where: {
                        id: order.group_work_id
                    },
                })

                // 拼团成功
                if (gw.total == (gw.num + 1)) {
                    // 修改拼团状态
                    gw.status = 'success'
                    gw.num = gw.num + 1
                    await gw.save({ transaction })

                    // 将该组团状态下的订单状态全部设置success
                    await app.model.Order.update({
                        status: "success"
                    }, {
                        where: {
                            status: "grouping",
                            group_work_id: gw.id
                        },
                        transaction
                    })

                    isCloseGroupTask = true
                } else {
                    gw.num = gw.num + 1
                    await gw.save({ transaction })
                }
            }

            // 提交事务
            await transaction.commit();

        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            return ctx.reply(err.message);
        }

        // 关闭拼团任务
        if (isCloseGroupTask) {
            await service.queue.removeAutoCloseGroupWorkTask(gw.id)
        }

        // 关闭自动取消订单延迟队列
        await service.queue.removeAutoCloseOrderTask(order.id)

        // 回复消息(参数为空回复成功, 传值则为错误消息)
        ctx.reply();
    }

    // 立即学习
    async learn() {
        const { ctx, app, service } = this;
        let user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id

        let { type, goods_id } = ctx.request.body
        let goodsIdDesc = '课程ID'
        if (type) {
            let d = {
                book: "电子书ID",
                course: "课程ID",
                column: "专栏ID",
                live: "直播ID"
            }
            goodsIdDesc = d[type]
        }

        ctx.validate({
            goods_id: {
                type: "int",
                required: true,
                desc: goodsIdDesc
            },
            type: {
                type: "string",
                required: true,
                range: { in: ['book', 'course', 'column', "live"]
                },
                desc: "类型"
            },
        })

        // 查询课程/专栏/电子书ID是否存在
        let goods = await service.order.findGoodsByTypeAndId(goods_id, type, goodsIdDesc + '不存在')

        if (goods.price != 0) {
            ctx.throw(400, '该' + goodsIdDesc + '需要购买之后才能学习')
        }

        // 是否已经购买过该课程/专栏/电子书
        if (!!(await this.isbuy(goods_id, type))) {
            ctx.throw(400, '你之前已经参加过啦')
        }

        let transaction;
        let price = goods.price
        let no = ctx.createOrderNo()
        try {
            // 建立事务对象
            transaction = await app.model.transaction();

            // 创建订单
            let order = await app.model.Order.create({
                school_id,
                user_id,
                no,
                status: "success",
                price,
                total_price: goods.price,
                type: 'default',
                pay_method: "free",
                pay_time: (new Date())
            }, { transaction })

            if (!order) ctx.throw(400, '创建订单失败')

            // 创建子订单
            let orderItem = await app.model.OrderItem.create({
                goods_id,
                type: ['media', 'audio', 'video', 'course'].includes(type) ? 'course' : type,
                school_id,
                order_id: order.id,
                user_id,
            }, { transaction })

            if (!orderItem) ctx.throw(400, '创建子订单失败')

            goods.sub_count = goods.sub_count + 1
            await goods.save({ transaction })

            // 提交事务
            await transaction.commit();

            ctx.apiSuccess(order);
        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            ctx.throw(400, err.message)
        }
    }

    // 创建秒杀订单
    async saveFlashsale() {
        const { ctx, app, service } = this;
        let user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id

        ctx.validate({
            flashsale_id: {
                type: "int",
                required: true,
                desc: '秒杀ID'
            },
        })

        let { flashsale_id } = ctx.request.body

        // 之前是否下单过，并且未支付，直接返回
        let beforeOrder = await app.model.Order.findOne({
            where: {
                school_id,
                user_id,
                status: "pendding",
                type: 'flashsale',
                flashsale_id
            }
        })
        if (beforeOrder) {
            return ctx.apiSuccess(beforeOrder)
        }

        // 可用秒杀商品是否存在
        let fs = await service.flashsale.getFlashsale(flashsale_id, false)
        let type = fs.type
        let goods_id = fs.goods_id
        let goodsIdDesc = '课程ID'
        if (type) {
            let d = {
                book: "电子书ID",
                course: "课程ID",
                column: "专栏ID"
            }
            goodsIdDesc = d[type]
        }


        // 查询课程/专栏/电子书ID是否存在
        let goods = await service.order.findGoodsByTypeAndId(goods_id, type, goodsIdDesc + '不存在')

        // 是否已经购买过该课程/专栏/电子书
        if (!!(await this.isbuy(goods_id, type))) {
            ctx.throw(400, '你之前已经购买过啦，请勿重复下单')
        }

        let transaction;
        let price = fs.price
        let no = ctx.createOrderNo()
        try {
            // 建立事务对象
            transaction = await app.model.transaction();

            // 创建订单
            let order = await app.model.Order.create({
                school_id,
                user_id,
                no,
                status: "pendding",
                price,
                total_price: goods.price,
                type: 'flashsale',
                flashsale_id
            }, { transaction })

            if (!order) ctx.throw(400, '创建订单失败')

            // 创建子订单
            let orderItem = await app.model.OrderItem.create({
                goods_id,
                type: ['media', 'audio', 'video', 'course'].includes(type) ? 'course' : type,
                school_id,
                order_id: order.id,
                user_id,
            }, { transaction })

            if (!orderItem) ctx.throw(400, '创建子订单失败')

            // 秒杀人数+1
            fs.used_num += 1
            await fs.save({ transaction })

            // 提交事务
            await transaction.commit();

            // 开启自动关闭订单延迟队列
            await service.queue.addAutoCloseOrderTask(order.id, 600)

            ctx.apiSuccess(order);
        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            ctx.throw(400, err.message)
        }
    }

    // 创建拼团订单
    async saveGroup() {
        const { ctx, app, service } = this;
        let user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id
        const Op = app.Sequelize.Op
        ctx.validate({
            group_id: {
                type: "int",
                required: true,
                desc: '拼团ID'
            },
            group_work_id: {
                type: "int",
                required: false,
                desc: '组团ID'
            }
        })

        let { group_id, group_work_id } = ctx.request.body

        // 之前是否已经发起过拼团，如果是直接返回订单信息
        let w = {
            school_id,
            user_id,
            status: {
                [Op.in]: ["grouping", "pendding"]
            },
            type: "group",
        }
        let beforeOrder = await app.model.Order.findOne({
            where: w,
            include: [{
                model: app.model.GroupWork,
                where: {
                    status: "pendding",
                    group_id
                },
                required: true
            }]
        })

        if (beforeOrder) {
            if (beforeOrder.status == 'grouping') {
                ctx.throw(400, '你已经发起拼团了，请勿重复操作')
            }
            // if (beforeOrder.group_work_id == group_work_id) {
            //     ctx.throw(400, '禁止跟自己拼团')
            // }
            return ctx.apiSuccess(beforeOrder);
        }

        // 拼团是否存在且有效
        let gp = await service.group.getGroup(group_id, false)
        let type = gp.type
        let goods_id = gp.goods_id
        let goodsIdDesc = '课程ID'
        if (type) {
            let d = {
                book: "电子书ID",
                course: "课程ID",
                column: "专栏ID"
            }
            goodsIdDesc = d[type]
        }

        // 查询课程/专栏/电子书ID是否存在
        let goods = await service.order.findGoodsByTypeAndId(goods_id, type, goodsIdDesc + '不存在')

        // 是否已经购买过该课程/专栏/电子书
        if (!!(await this.isbuy(goods_id, type))) {
            ctx.throw(400, '你之前已经购买过啦，请勿重复下单')
        }

        let transaction;
        let price = gp.price
        let no = ctx.createOrderNo()
        try {
            // 建立事务对象
            transaction = await app.model.transaction();

            // 验证组团ID，是否存在，状态是否正确，人数是否达标
            let groupwork = null
            if (group_work_id) {
                groupwork = await service.groupWork.getGroupWork(group_work_id, group_id)
            } else {
                groupwork = await app.model.GroupWork.create({
                    school_id,
                    num: 0,
                    total: gp.p_num,
                    status: "pendding",
                    expire: gp.expire,
                    group_id
                }, { transaction })
            }

            // 创建订单
            let order = await app.model.Order.create({
                school_id,
                user_id,
                no,
                status: "pendding",
                price,
                total_price: goods.price,
                type: 'group',
                group_work_id: groupwork.id
            }, { transaction })

            if (!order) ctx.throw(400, '创建订单失败')

            // 创建子订单
            let orderItem = await app.model.OrderItem.create({
                goods_id,
                type: ['media', 'audio', 'video', 'course'].includes(type) ? 'course' : type,
                school_id,
                order_id: order.id,
                user_id,
            }, { transaction })

            if (!orderItem) ctx.throw(400, '创建子订单失败')

            // 提交事务
            await transaction.commit();

            // 开启自动关闭订单延迟队列
            await service.queue.addAutoCloseOrderTask(order.id)

            // 开启自动关闭/完成拼团延迟队列
            await service.queue.addAutoCloseGroupWorkTask(groupwork.id, groupwork.expire)

            ctx.apiSuccess(order);
        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            ctx.throw(400, err.message)
        }
    }
}

module.exports = OrderController;