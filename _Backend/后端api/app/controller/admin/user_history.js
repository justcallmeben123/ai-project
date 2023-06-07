'use strict';

const Controller = require('./base');

class User_historyController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.UserHistory
    }

    async getListOptions() {
        let { ctx, app, service } = this;

        return {
            validate: {
                user_id: {
                    type: "int",
                    required: true,
                    desc: "网校用户ID"
                },
            },
            limit: 10,
            options: {
                where: {
                    school_id: ctx.currentSchool.id,
                    user_id: ctx.query.user_id,
                },
                include: [{
                    model: app.model.Course,
                    attributes: ['title', 'type'],
                }],
                attributes: ['id', 'total_time'],
                order: [
                    ['id', 'DESC']
                ],
            }
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        let { app } = this
        return {
            total: data.count,
            items: data.rows.map(item => {
                let c = item.course || {}
                return {
                    id: item.id,
                    title: c.title || '已删除',
                    total_time: app.secondToDate(item.total_time),
                    type: c.type || '已删除',
                }
            })
        }
    }
}

module.exports = User_historyController;