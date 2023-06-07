'use strict';

const Controller = require('../base');

class BbsController extends Controller {
    async index() {
        const { ctx, app } = this

        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            status: 1
        }

        let res = await this.list(app.model.Bbs, {
            where,
            attributes: ['id', 'title'],
            order: [
                ['id', 'DESC']
            ],
        })

        // 统计总用户数
        let userCount = await app.model.SchoolUser.count({
            where: {
                school_id
            }
        })

        // 获取总帖子数
        let postCount = await app.model.Post.count({
            where: {
                school_id
            }
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows,
            userCount,
            postCount
        })
    }
}

module.exports = BbsController;