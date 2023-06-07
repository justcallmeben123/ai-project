'use strict';

const Controller = require('./base');

class Order_itemController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.OrderItem
    }

    async getListOptions() {
        let { ctx, app, service } = this;

        let { comment } = ctx.query

        let attributes = ['created_time', 'type']
        let where = {
            school_id: ctx.currentSchool.id,
            type: ctx.query.type || 'course'
        }
        if (comment == 1) {
            attributes = [...attributes, 'comment', 'comment_time']
            const Op = app.Sequelize.Op
            where.comment = {
                [Op.ne]: null
            }
            delete where.type
        }

        return {
            validate: {
                user_id: {
                    type: "int",
                    required: true,
                    desc: "网校用户ID"
                },
                type: {
                    type: "string",
                    required: false,
                    range: { in: ['course', 'column']
                    },
                    desc: "类型"
                },
                comment: {
                    type: "int",
                    required: false,
                    range: { in: [0, 1]
                    },
                }
            },
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.Course,
                    attributes: ['id', 'title', 'price', 'type']
                }, {
                    model: app.model.Column,
                    attributes: ['id', 'title', 'price']
                }, {
                    model: app.model.Order,
                    where: {
                        school_id: ctx.header.school_id,
                        user_id: ctx.query.user_id,
                        status: "success"
                    },
                    attributes: ['id'],
                }],
                attributes,
                order: [
                    ['id', 'DESC']
                ]
            }
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: data.rows.map(item => {
                let c = item[item.type]
                let result = {
                    created_time: item.created_time,
                    id: c ? c.id : 'null',
                    price: c ? c.price : 'null',
                    title: c ? c.title : 'null',
                    type: item.type == 'column' ? item.type : (c ? c.type : 'null'),
                }
                if (this.ctx.query.comment == 1) {
                    result.comment = item.comment
                    result.comment_time = item.comment_time
                }
                return result
            })
        }
    }
}

module.exports = Order_itemController;