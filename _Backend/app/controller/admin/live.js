'use strict';

const Controller = require('./base');

class LiveController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Live
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id
        }

        let { title, sort } = ctx.query
            // 关键词
        if (title != undefined && title != '') {
            const Op = app.Sequelize.Op
            where.title = {
                [Op.like]: `%${title}%`
            }
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

    // 返回列表数据之前
    async afterIndex(data) {
        let { app, service } = this
        return {
            total: data.count,
            items: data.rows.map(res => {
                res.status = service.live.getStatus(res)
                res.start_time = app.formatTime(res.start_time)
                res.end_time = app.formatTime(res.end_time)
                return res
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
                desc: '直播标题'
            },
            cover: {
                type: 'string',
                required: false,
                desc: '直播封面'
            },
            try: {
                type: 'string',
                required: true,
                desc: "直播介绍"
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
        let { school_id } = this.ctx.header

        // 验证开始和结束时间
        await this.validateStartTimeAndEndTime()

        // 生成唯一key
        let key = this.ctx.genID();

        return {
            key,
            ...data,
            school_id
        }
    }

    // 查询单个返回数据处理
    async afterRead(data) {
        let { ctx, service } = this
        let res = service.live.getPushAndPlayUrl(data.key, data.end_time)
        return {
            ...data,
            ...res
        }
    }

    // 更新之前查询
    async beforeUpdate() {
        let { ctx, app, service } = this;
        let { id } = ctx.request.body
        let { school_id } = ctx.header
        let d = await this.findOrFail(this.model, {
            id,
            school_id
        })

        let status = service.live.getStatus(d)

        if (status != '未开始') {
            ctx.throw(400, '当前直播' + status + ',禁止修改')
        }

        return d
    }

    // 删除之前
    async beforeDelete(where) {
        where.school_id = this.ctx.header.school_id
        return where
    }
}

module.exports = LiveController;