'use strict';

const Service = require('egg').Service;

class BaseService extends Service {
    // 查询，不存在则报异常
    async findOrFail(modelName, options = {}, failMsg = '该记录不存在') {
        const { ctx, app } = this
        let res = await app.model[modelName].findOne(options)
        if (!res) ctx.throw(404, failMsg)
        return res
    }
}

module.exports = BaseService;