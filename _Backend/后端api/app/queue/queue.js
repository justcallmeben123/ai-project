module.exports = app => {
    // 获取缓存
    async function getCache(key) {
        const { redis } = app
        const result = await redis.get(key)
        return JSON.parse(result)
    }

    // 关闭订单
    async function closeOrder(job) {
        let { orderId } = job.data
        console.log('关闭订单ID：', orderId);
        // 清除缓存
        await app.redis.del(`orderId_${orderId}`)

        // 拿到当前订单
        let order = await app.model.Order.findOne({
            where: { id: orderId }
        })

        // 订单不存在，关闭任务
        // 判断对应的订单是否已经被支付,如果已经支付则不需要关闭订单，直接退出
        if (!order || order.status == 'success' || order.status == 'grouping') {
            return Promise.resolve();
        }

        // 通过事务执行 sql
        let transaction = await app.model.transaction();
        try {
            // 关闭订单
            order.status = 'closed'
            await order.save({ transaction })

            // 修改优惠券使用状态
            if (order.user_coupon_id) {
                let userCoupon = await app.model.UserCoupon.findOne({
                    where: {
                        id: order.user_coupon_id
                    }
                })
                if (userCoupon) {
                    userCoupon.used = 0
                    await userCoupon.save({ transaction })
                }
            }

            // 如果是秒杀，秒杀人数-1
            if (order.type == 'flashsale' && order.flashsale_id) {
                console.log('秒杀数-1')
                let flashsale = await app.model.Flashsale.findOne({
                    where: {
                        id: order.flashsale_id
                    }
                })
                if (flashsale && flashsale.used_num > 0) {
                    flashsale.used_num = flashsale.used_num - 1
                    await flashsale.save({ transaction })
                }
            }

            // 如果是拼团订单，且拼团人数小于1，则关闭组团延迟任务
            if (order.type == 'group' && order.group_work_id) {
                let gw = await app.model.GroupWork.findOne({
                    where: {
                        id: order.group_work_id,
                        status: "pendding",
                    }
                })
                console.log('关闭组团延迟任务 ' + order.group_work_id)
                if (gw && gw.num == 0) {
                    gw.status = 'fail'
                    await gw.save({ transaction })

                    // 关闭拼团队列
                    const k = `groupWorkId_${gw.id}`
                    let jobId = await getCache(k)
                    if (!jobId) return
                    let job = await app.Queue.getJob(jobId)
                    if (!job) return
                    let state = await job.getState()
                    if (state == 'delayed') {
                        job.remove()
                    }
                }
            }
            // 提交事务
            await transaction.commit();
            return Promise.resolve();
        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            return Promise.reject(new Error(err.message));
        }
    }

    // 关闭考试
    async function closeTest(job) {
        let { testId } = job.data
        console.log('关闭考试ID：', testId);
        // 清除缓存
        await app.redis.del(`testId_${testId}`)

        // 拿到当前考试
        let test = await app.model.UserTest.findOne({
            where: { id: testId }
        })

        // 考试不存在，关闭任务
        // 判断对应的考试是否已经交卷,如果已经交卷直接退出
        if (!test || test.answer_status == 1) {
            return Promise.resolve();
        }

        test.answer_status = 1
        await test.save()

        console.log('关闭考试完成')
    }

    // 关闭拼团
    async function closeGroup(job) {
        let { groupWorkId } = job.data
        console.log('关闭组团ID：', groupWorkId);
        // 清除缓存
        await app.redis.del(`groupWorkId_${groupWorkId}`)

        // 拿到当前组团
        let gw = await app.model.GroupWork.findOne({
            where: {
                id: groupWorkId,
                status: "pendding",
            }
        })

        if (!gw) {
            return Promise.resolve();
        }

        // 拼团失败，订单状态改为closed，退款，减少订阅人数
        // if(gw.auto == 0 && gw.total > gw.num ){

        // }

        // 通过事务执行 sql
        let transaction = await app.model.transaction();
        try {
            let isSuccess = gw.num != 0

            // 拼团成功，组团状态改为success，订单状态改为success
            gw.status = isSuccess ? 'success' : 'fail'
            await gw.save({ transaction })

            await app.model.Order.update({
                status: isSuccess ? 'success' : 'closed'
            }, {
                where: {
                    status: "grouping",
                    group_work_id: gw.id
                },
                transaction
            })

            // 提交事务
            await transaction.commit();

            return Promise.resolve();
        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            return Promise.reject(new Error(err.message));
        }
    }

    app.Queue.process(async(job) => {
        let { orderId, testId, groupWorkId } = job.data
        if (orderId) {
            await closeOrder(job)
        } else if (testId) {
            await closeTest(job)
        } else if (groupWorkId) {
            await closeGroup(job)
        }
    });
};