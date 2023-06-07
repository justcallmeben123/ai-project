'use strict';

const Service = require('egg').Service;

class QueueService extends Service {
    /**
     * 添加自动关闭订单任务
     * @param {int} orderId 订单ID
     * @param {int} delay 延迟秒数
     */
    async addAutoCloseOrderTask(orderId, delay = 1800) {
        const { app, service } = this
        let job = await app.Queue.add({
            orderId
        }, {
            delay: delay * 1000,
            attempts: 3,
            backoff: {
                type: "fixed",
                delay: 1000
            },
            // removeOnFail: true
        });

        const k = `orderId_${orderId}`

        // 移除之前的延时任务
        await this.removeAutoCloseOrderTask(orderId)
        await service.cache.set(k, job.id)
        return job
    }

    /**
     * 关闭自动关闭订单任务
     * @param {int} orderId 订单ID
     */
    async removeAutoCloseOrderTask(orderId) {
        const { service, app } = this

        const k = `orderId_${orderId}`
        let jobId = await service.cache.get(k)
        if (!jobId) return
        let job = await app.Queue.getJob(jobId)
        if (!job) return
        let state = await job.getState()
        if (state == 'delayed') {
            job.remove()
        }
    }

    /**
     * 添加自动关闭考试任务
     * @param {int} testId 考试ID
     * @param {int} delay 延迟秒数
     */
    async addAutoCloseTestTask(testId, delay = 1800) {
        const { app, service } = this
        let job = await app.Queue.add({
            testId
        }, {
            delay: delay * 1000,
            attempts: 3,
            backoff: {
                type: "fixed",
                delay: 1000
            },
            // removeOnFail: true
        });

        const k = `testId_${testId}`

        // 移除之前的延时任务
        await this.removeAutoCloseTestTask(testId)
        await service.cache.set(k, job.id)
        return job
    }

    /**
     * 关闭自动关闭考试任务
     * @param {int} testId 考试ID
     */
    async removeAutoCloseTestTask(testId) {
        const { service, app } = this

        const k = `testId_${testId}`
        let jobId = await service.cache.get(k)
        if (!jobId) return
        let job = await app.Queue.getJob(jobId)
        if (!job) return
        let state = await job.getState()
        if (state == 'delayed') {
            job.remove()
        }
    }

    /**
     * 添加自动关闭/完成拼团任务
     * @param {int} testId 组团ID
     * @param {int} delay 延迟秒数
     */
    async addAutoCloseGroupWorkTask(groupWorkId, delay) {
        const { app, service } = this
        const expire = delay * 60 * 60 * 1000
        let job = await app.Queue.add({
            groupWorkId
        }, {
            delay: expire,
            attempts: 3,
            backoff: {
                type: "fixed",
                delay: 1000
            },
            // removeOnFail: true
        });

        const k = `groupWorkId_${groupWorkId}`

        // 移除之前的延时任务
        await this.removeAutoCloseGroupWorkTask(groupWorkId)
        await service.cache.set(k, job.id)
        return job
    }

    /**
     * 关闭自动关闭/完成拼团任务
     * @param {int} testId 组团ID
     */
    async removeAutoCloseGroupWorkTask(groupWorkId) {
        const { service, app } = this

        const k = `groupWorkId_${groupWorkId}`
        let jobId = await service.cache.get(k)
        if (!jobId) return
        let job = await app.Queue.getJob(jobId)
        if (!job) return
        let state = await job.getState()
        if (state == 'delayed') {
            job.remove()
        }
    }
}

module.exports = QueueService;