'use strict';

const Controller = require('./base');

class GroupController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Group
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }
        
        if (ctx.query.usable) {
            let Op = app.Sequelize.Op
            where.start_time = {
                [Op.lt]: new Date(),
            }
            where.end_time = {
                [Op.gt]: new Date(),
            }
        }

        if (ctx.query.status != undefined) {
            where.status = ctx.query.status
        }
        
        return {
            validate: {},
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.Course,
                    attributes: ['id', 'title', 'price', 'type', 'cover']
                }, {
                    model: app.model.Column,
                    attributes: ['id', 'title', 'price', 'cover']
                }],
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
                let c = item[item.type] || {}
                item.value = {
                    id: c.id || 'null',
                    title: c.title || 'null',
                    cover: c.cover || 'null',
                    price: c.price || 'null',
                    type: item.type == 'column' ? item.type : (c.type || 'null'),
                }
                delete item.course
                delete item.column
                return item
            })
        }
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        let { type } = ctx.request.body
        return {
            type: {
                type: 'string',
                required: true,
                range: { in: ['course', 'column']
                },
                desc: '类型'
            },
            goods_id: {
                type: 'int',
                required: true,
                desc: type == 'course' ? '课程ID' : '专栏ID'
            },
            price: {
                type: 'float',
                required: true,
                desc: '价格'
            },
            p_num: {
                type: 'int',
                required: true,
                desc: '拼团人数'
            },
            auto: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '是否自动成团'
            },
            expire: {
                type: 'int',
                required: true,
                desc: '拼团时限'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '状态'
            },
            start_time: {
                type: 'string',
                required: true,
                desc: '开始时间'
            },
            end_time: {
                type: 'string',
                required: true,
                desc: '结束时间'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { ctx } = this
        let { school_id } = ctx.header
            // 验证开始和结束时间
        await this.validateStartTimeAndEndTime()

        // 验证 课程/专栏id是否存在
        await this.validateGoodsId()

        return {
            ...data,
            school_id
        }
    }

    // 更新之前查询
    async beforeUpdate() {
        let { ctx, app, service } = this;
        let { id } = ctx.request.body
        let { school_id } = ctx.header
        let res = await this.findOrFail(this.model, {
            id,
            school_id
        })

        // 进行中/已结束/已下架不能修改
        await this.isDisabledUpdate(res)

        // 验证开始和结束时间
        await this.validateStartTimeAndEndTime()

        // 验证 课程/专栏id是否存在
        await this.validateGoodsId()

        return res
    }

    // 更新指定字段之前
    async beforeUpdateByKey(M, key) {
        if (key !== 'status') {
            return M
        }
        // 进行中/已结束/已下架不能修改
        await this.isDisabledUpdate(M)

        return M
    }
}

module.exports = GroupController;