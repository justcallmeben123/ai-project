'use strict';

const Controller = require('./base');

class ColumnController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Column
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }

        let { title, status, sort } = ctx.query
            // 关键词
        if (title != undefined && title != '') {
            const Op = app.Sequelize.Op
            where.title = {
                [Op.like]: `%${title}%`
            }
        }

        // 状态
        if (status != undefined && status != '') {
            where.status = status
        }

        // 排序
        sort = sort === '+id' ? 'ASC' : 'DESC'

        return {
            validate: {},
            limit: 10,
            options: {
                where,
                order: [
                    ['id', sort]
                ]
            }
        }
    }

    // 查询单个之前
    async beforeRead(opt) {
        opt.where.school_id = this.ctx.header.school_id
        return opt
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            title: {
                type: 'string',
                required: true,
                desc: '专栏标题'
            },
            cover: {
                type: 'string',
                required: false,
                desc: '专栏封面'
            },
            try: {
                type: 'string',
                required: true,
                desc: '描述'
            },
            content: {
                type: 'string',
                required: true,
                desc: '专栏介绍'
            },
            price: {
                type: 'float',
                required: true,
                desc: '价格'
            },
            t_price: {
                type: 'float',
                required: true,
                desc: '划线价格'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '状态'
            },
            isend: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '完结状态'
            }
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
        this.testThrow(id)
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

    // 设置更新状态
    async updateend() {
        await this.updateByKey('isend', '更新状态')
    }
    
    // 上架下架
    async updateStatus() {
        let { id } = this.ctx.request.body
        this.testThrow(id)
        await this.updateByKey('status')
    }
    
    // 演示数据禁止操作
    testThrow(id, msg = '演示数据，禁止操作'){
        let ids = [3,184]
        if(ids.includes(id)){
            this.ctx.throw(400, msg)
        }
    }

}

module.exports = ColumnController;