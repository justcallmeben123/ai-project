'use strict';

const Controller = require('../base');

class Group_workController extends Controller {
    // 可拼团列表
    async index() {
        const { ctx, app } = this
        const Op = app.Sequelize.Op

        const { group_id } = ctx.query

        let res = await this.list(app.model.GroupWork, {
            where: {
                school_id: ctx.currentSchool.id,
                group_id,
                status: "pendding",
                num: {
                    [Op.gt]: 0
                }
            },
            attributes: ['id', 'num', 'total', 'expire', 'created_time'],
            include: [{
                model: app.model.Order,
                attributes: ['status'],
                where: {
                    status: "grouping"
                },
                include: [{
                    model: app.model.User,
                    attributes: ['username', 'nickname', 'avatar'],
                }]
            }],
            order: [
                ['id', 'DESC']
            ]
        }, {
            group_id: {
                type: "int",
                required: true,
                desc: '拼团ID'
            },
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(o => {
                o.users = o.orders.map(v => {
                    return v.user
                })
                delete o.orders
                return o
            })
        })
    }
}

module.exports = Group_workController;