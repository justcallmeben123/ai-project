'use strict';

const Controller = require('./base');

class CashController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Cash
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }
        let { status } = ctx.query
            // 状态
        if (status != undefined) {
            where.status = status
        }

        return {
            validate: {},
            limit: 10,
            options: {
                where,
                order: [
                    ['id', 'DESC']
                ]
            }
        }
    }
    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            account: {
                type: 'string',
                required: true,
                desc: '账户'
            },
            province: {
                type: 'string',
                required: true,
                desc: '省'
            },
            city: {
                type: 'string',
                required: true,
                desc: '市'
            },
            area: {
                type: 'string',
                required: true,
                desc: '区'
            },
            path: {
                type: 'string',
                required: true,
                desc: '地址'
            },
            bank: {
                type: 'string',
                required: true,
                desc: '所属银行'
            },
            name: {
                type: 'string',
                required: true,
                desc: '收款人'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '状态'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { school_id } = this.ctx.header
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
        return await this.findOrFail(this.model, {
            id,
            school_id
        })
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

module.exports = CashController;