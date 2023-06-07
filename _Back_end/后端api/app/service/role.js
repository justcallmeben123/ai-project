'use strict';

const Service = require('egg').Service;

class RoleService extends Service {
    async findByKey(key = 'id', value = 0, status = false) {
        let { app } = this;
        let where = {}
        where[key] = value
        if (typeof status == 'number') {
            where.status = status
        }
        return await app.model.Role.findOne({ where })
    }

    async isExist(id, status = false) {
        let { ctx, app } = this;
        let d = await this.findByKey('id', id, status)
        if (!d) {
            ctx.throw(404, '当前角色不存在')
        }
        return d
    }

    // 过滤角色id
    async filterIds(ids) {
        let { app } = this;
        let rows = await app.model.Role.findAll({
            where: {
                id: ids
            },
            attributes: ['id']
        })
        rows = app.toArray(rows)

        return rows.map(item => item.id)
    }
}

module.exports = RoleService;