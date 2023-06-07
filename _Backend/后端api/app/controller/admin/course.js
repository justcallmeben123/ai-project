'use strict';

const Controller = require('./base');

class CourseController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Course
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
            type: ctx.query.type || 'media'
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
    // 表单验证规则
    get rules() {
        let { ctx } = this
        let type = ctx.request.body.type || 'media'
        let d = {
            media: {
                title: "图文",
                try: "试看内容",
                content: "图文详情"
            },
            audio: {
                title: "音频",
                try: "音频介绍",
                content: "mp3地址"
            },
            video: {
                title: "视频",
                try: "视频介绍",
                content: "视频地址"
            }
        }

        let c = d[type]

        if (!c) {
            c = {
                title: "课程",
                try: "课程介绍",
                content: "课程内容"
            }
        }

        return {
            title: {
                type: 'string',
                required: true,
                desc: c.title + '标题'
            },
            cover: {
                type: 'string',
                required: false,
                desc: c.title + '封面'
            },
            try: {
                type: 'string',
                required: true,
                desc: c.try
            },
            content: {
                type: 'string',
                required: true,
                desc: c.content
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
            type: {
                type: 'string',
                required: true,
                range: { in: ['media', 'audio', 'video']
                },
                desc: '类型：media图文，audio音频，video视频'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '状态'
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
        
        // 演示数据判断
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
    
    // 上架下架
    async updateStatus() {
        let { id } = this.ctx.request.body
        this.testThrow(id)
        await this.updateByKey('status')
    }
    
    // 演示数据禁止操作
    testThrow(id, msg = '演示数据，禁止操作'){

        let ids = [25,6,7,3,11,903,904,905,906,931]
        if(ids.includes(id)){
            this.ctx.throw(400, msg)
        }
    }
}

module.exports = CourseController;