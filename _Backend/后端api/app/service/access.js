'use strict';

const Service = require('egg').Service;

class AccessService extends Service {
    async filterIds(ids, has_ids) {
        let { app } = this;
        let rows = await app.model.Access.findAll({
            where: {
                id: ids
            },
            attributes: ['id']
        })
        rows = app.toArray(rows)
        ids = rows.map(item => item.id)

        return {
            add_ids: ids.filter(id => !has_ids.includes(id)),
            del_ids: has_ids.filter(id => !ids.includes(id))
        }
    }
}

module.exports = AccessService;