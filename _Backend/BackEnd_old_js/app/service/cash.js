'use strict';

const Service = require('egg').Service;

class CashService extends Service {
    async isExist(id, school_id = 0) {
        let { ctx, app } = this;
        if (school_id == 0) {
            school_id = ctx.currentSchool.id
        }
        let d = await app.model.Cash.findOne({
            where: {
                school_id,
                id
            }
        })
        if (!d) {
            ctx.throw(404, '收款账户ID不存在')
        }

        return d
    }
}

module.exports = CashService;