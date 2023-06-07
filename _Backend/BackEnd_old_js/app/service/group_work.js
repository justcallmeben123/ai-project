'use strict';

const Service = require('egg').Service;

class Group_workService extends Service {
    // 获取组团
    async getGroupWork(id, group_id) {
        const { ctx, app, service } = this;
        const school_id = ctx.currentSchool.id
        const Op = app.Sequelize.Op
        let groupwork = await app.model.GroupWork.findOne({
            where: {
                id,
                school_id,
                status: "pendding",
                group_id,
                num: {
                    [Op.gt]: 0,
                }
            }
        })
        if (!groupwork) {
            ctx.throw(404, '当前组团ID不存在')
        }
        return groupwork
    }

}

module.exports = Group_workService;