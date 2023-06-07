'use strict';

const Controller = require('./base');

class OrderController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Order
    }

    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.currentSchool.id,
        }

        if (ctx.query.user_id) {
            where.user_id = ctx.query.user_id
        }

        if (ctx.query.status) {
            where.status = ctx.query.status
        }

        if (ctx.query.no) {
            const Op = app.Sequelize.Op
            where.no = {
                [Op.like]: `%${ctx.query.no}%`
            }
        }

        return {
            validate: {},
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.OrderItem,
                    where: {
                        school_id: ctx.header.school_id,
                    },
                    attributes: ['id', 'type'],
                    include: [{
                        model: app.model.Course,
                        attributes: ['title', 'type'],
                    }, {
                        model: app.model.Column,
                        attributes: ['title'],
                    }],
                }],
                // attributes: ['id', 'no', 'price', 'status', 'created_time'],
                order: [
                    ['id', 'DESC']
                ],
            }
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: data.rows.map(item => {
                item.goods = []
                item.title = (item.order_items.map(o => {
                    let c = o[o.type]
                    let title = c ? c.title : 'null'
                    let type = o.type == 'column' ? o.type : (c ? c.type : 'null')
                    let obj = {
                        column: "专栏",
                        media: "图文",
                        audio: "音频",
                        video: "视频"
                    }
                    if (c) {
                        item.goods.push(c)
                    }
                    return `[${obj[type]}]${title}`
                })).join(',')
                delete item.order_items
                return item
            })
        }
    }

    // 删除之前
    async beforeDelete(where) {
        where.school_id = this.ctx.header.school_id
        if(this.ctx.header.school_id == 11){
            this.ctx.throw(400, '演示数据，禁止删除')
        }
        return where
    }
}

module.exports = OrderController;