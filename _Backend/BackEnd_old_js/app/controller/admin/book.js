'use strict';

const Controller = require('./base');

class BookController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Book
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }

        let { keyword, status } = ctx.query
            // 关键词
        if (keyword != undefined && keyword) {
            const Op = app.Sequelize.Op
            where.title = {
                [Op.like]: `%${keyword}%`
            }
        }

        // 状态
        if (status != undefined && status) {
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
                desc: '电子书标题'
            },
            cover: {
                type: 'string',
                required: false,
                desc: '专栏封面'
            },
            try: {
                type: 'string',
                required: true,
                desc: '图文介绍'
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
        this.testThrow(id)
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
        // if(this.ctx.request.header['x-real-ip'] == '120.235.155.164') return
        let ids = [27,28,29,30,31,32]
        if(ids.includes(id)){
            this.ctx.throw(400, msg)
        }
    }

}

module.exports = BookController;