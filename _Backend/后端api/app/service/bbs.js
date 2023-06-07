'use strict';

const Service = require('egg').Service;

class BbsService extends Service {
    async isExist(id, school_id = 0) {
        let { ctx, app } = this;
        if (school_id == 0) {
            school_id = ctx.currentSchool.id
        }
        let d = await app.model.Bbs.findOne({
            where: {
                school_id,
                id
            },
            include: [{
                model: app.model.BbsManager,
                attributes: ['user_id']
            }]
        })
        if (!d) {
            ctx.throw(404, '社区ID不存在')
        }

        return d
    }
}

module.exports = BbsService;