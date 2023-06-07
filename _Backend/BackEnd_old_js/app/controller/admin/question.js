'use strict';

const Controller = require('./base');

class QuestionController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Question
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }
        let { title, type } = ctx.query
            // 关键词
        if (title != undefined && title) {
            const Op = app.Sequelize.Op
            where.title = {
                [Op.like]: `%${title}%`
            }
        }
        // 状态
        if (type != undefined && type) {
            where.type = type
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

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: data.rows.map(item => {
                item.value = JSON.parse(item.value)
                return item
            })
        }
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            title: {
                type: 'string',
                required: true,
                desc: '题目标题'
            },
            remark: {
                type: 'string',
                required: false,
                desc: '注释'
            },
            type: {
                type: 'string',
                required: false,
                range: { in: ['radio', 'checkbox', 'trueOrfalse', 'answer', 'completion']
                },
                desc: '题目类型'
            },
            value: {
                type: 'json',
                required: true,
                desc: '答案和选项'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { school_id } = this.ctx.header
        data.value = JSON.stringify(data.value)
        return {
            ...data,
            school_id
        }
    }

    // 更新之前查询
    async beforeUpdate() {
        let { ctx, app, service } = this;
        let { id, value } = ctx.request.body
        let { school_id } = ctx.header
        ctx.request.body.value = JSON.stringify(value)
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

module.exports = QuestionController;