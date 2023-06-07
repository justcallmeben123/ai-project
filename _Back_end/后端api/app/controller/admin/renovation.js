'use strict';

const Controller = require('./base');

class RenovationController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Renovation
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }

        let { ismobile } = ctx.query
            // 移动/PC
        where.ismobile = (ismobile != undefined && ismobile) ? ismobile : 1

        return {
            validate: {},
            limit: 10,
            options: {
                where,
                order: [
                    ['id', 'DESC']
                ],
                attributes: {
                    exclude: ['template']
                }
            }
        }
    }

    // 查询单个之前
    async beforeRead(opt) {
        opt.where.school_id = this.ctx.header.school_id
        return opt
    }

    // 查询单个返回数据处理
    async afterRead(data) {
        return {
            id: data.id,
            title: data.title,
            ismobile: data.ismobile,
            template: data.template ? JSON.parse(data.template) : []
        }
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            title: {
                type: 'string',
                required: true,
                desc: '页面标题'
            },
            ismobile: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '是否是移动端'
            },
            template: {
                type: 'json',
                required: false,
                desc: '模板数据'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { ctx } = this
        let { school_id } = ctx.header
        return {
            ...data,
            type: "common",
            school_id
        }
    }

    // 更新之前查询
    async beforeUpdate() {
        let { ctx, app, service } = this;
        let { id, template } = ctx.request.body
        let { school_id } = ctx.header
        delete ctx.request.body.ismobile
        if (template) {
            ctx.request.body.template = JSON.stringify(template)
        } else {
            delete ctx.request.body.template
        }
        
        if(ctx.request.header['x-real-ip'] != '120.235.190.10'){
            if(id == 1 || id == 2){
                this.ctx.throw(400, '演示数据，禁止修改')
            }
        }
        
        return await this.findOrFail(this.model, {
            id,
            school_id,
        })
    }

    // 删除之前
    async beforeDelete(where) {
        let { ctx } = this
        where.school_id = ctx.header.school_id
        if(this.ctx.header.school_id == 11){
            this.ctx.throw(400, '演示数据，禁止删除')
        }
        where.isdefault = 0
        return where
    }
}

module.exports = RenovationController;