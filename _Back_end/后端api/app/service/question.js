'use strict';

const Service = require('egg').Service;

class QuestionService extends Service {
    async filterIds(ids) {
        let { app, ctx } = this;
        let rows = await app.model.Question.findAll({
            where: {
                id: ids,
                school_id: ctx.header.school_id
            },
            attributes: ['id']
        })
        rows = app.toArray(rows)

        return rows.map(item => item.id)
    }
}

module.exports = QuestionService;