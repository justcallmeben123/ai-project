'use strict';

const Controller = require('../base');

class NoticeController extends Controller {
    // 列表
    async index() {
        const { ctx, app } = this

        const school_id = ctx.currentSchool.id

        let res = await this.list(app.model.Notice, {
            where: {
                school_id,
            },
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess(res)
    }
}

module.exports = NoticeController;