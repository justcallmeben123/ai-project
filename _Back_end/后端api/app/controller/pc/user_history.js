'use strict';

const Controller = require('../base');

class User_historyController extends Controller {
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        const { type = "course" } = ctx.query
        let where = {
            school_id,
            user_id: ctx.authUser.id,
            type
        }

        if (!(['course', 'column', 'book'].includes(type))) {
            ctx.throw(422, 'type值必须是 course,column,book 其中一个')
        }

        let attributes = ['id', 'title', 'cover']
        if (type == 'course') {
            attributes.push('type')
        }
        let include = [{
            model: app.model[ctx.firstToUpper(type)],
            attributes,
            where: {
                status: 1
            },
            required: true
        }]

        let res = await this.list(app.model.UserHistory, {
            where,
            include,
            attributes: ['total_time'],
            order: [
                ['updated_time', 'DESC'],
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                let c = item[type] || {}
                return {
                    ...c,
                    progress: item.total_time
                }
            })
        })
    }

    // 更新课程进度
    async updateCourse() {
        let { ctx, app, service } = this;
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id;

        let { id, type, progress } = ctx.request.body

        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: "课程ID"
            },
            progress: {
                type: "float",
                required: true,
                desc: "学习进度"
            },
        })

        // 是否存在
        let c = await app.model.Course.findOne({
            where: {
                school_id,
                id,
                status: 1
            },
            attributes: ['id', 'price']
        })
        if (!c) {
            ctx.throw(404, '课程ID不存在')
        }

        // 是否购买
        if (c.price != 0 && !(await this.isbuy(id, 'course'))) {
            ctx.throw(400, '请先购买该课程')
        }

        progress = parseFloat(progress) > 100 ? 100 : progress

        let where = {
            school_id,
            user_id,
            goods_id: id,
            type
        }
        let uh = await app.model.UserHistory.findOne({ where })

        // 存在则更新
        if (uh) {
            uh.total_time = progress
            return await uh.save()
        }

        // 不存在则创建
        where.total_time = progress
        return await app.model.UserHistory.create(where)
    }

    // 更新专栏/电子书进度
    async updateColumnOrBook() {
        let { ctx, app } = this;
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id;
        const { id, type, detail_id } = ctx.request.body
        const d = {
            column: "专栏",
            book: "电子书"
        }
        const desc = d[type]
        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: desc + "ID"
            },
            detail_id: {
                type: "int",
                required: true,
                desc: desc + "详情ID"
            },
        })

        // 是否存在
        let include = []
        if (type == 'column') {
            include = [{
                model: app.model.ColumnCourse,
                attributes: ['course_id'],
                include: [{
                    model: app.model.Course,
                    attributes: ['price'],
                    where: {
                        status: 1
                    },
                    required: true
                }],
                required: false
            }]
        } else {
            include = [{
                model: app.model.BookDetail,
                attributes: ['id', 'isfree'],
            }]
        }
        let g = await app.model[ctx.firstToUpper(type)].findOne({
            where: {
                school_id,
                id,
                status: 1
            },
            include,
            attributes: ['id', 'price']
        })
        if (!g) {
            ctx.throw(404, desc + 'ID不存在')
        }

        let details = []
        if (type == 'column') {
            details = g.column_courses.map(o => {
                return {
                    id: o.course_id,
                    price: o.course.price
                }
            })
        } else if (type == 'book') {
            details = g.book_details
        }

        let detailsIds = details.map(o => o.id)

        let dt = details.find(o => o.id == detail_id)

        if (!dt) {
            ctx.throw(422, desc + '内容ID不存在')
        }

        let price = type == 'column' ? (dt.price > 0 ? g.price : 0) : (dt.isfree == 1 ? 0 : g.price)

        // 是否购买
        if (price != 0 && !(await this.isbuy(id, type))) {
            ctx.throw(400, '请先购买该' + desc)
        }

        let where = {
            school_id,
            user_id,
            goods_id: id,
            type
        }
        let uh = await app.model.UserHistory.findOne({ where })

        let extra = []
        let progress = 0

        // 存在则更新
        if (uh) {
            extra = uh.extra.split(',')

            // 已经更新过该记录
            if ((detailsIds.filter(o => o == detail_id)).length <= (extra.filter(o => o == String(detail_id))).length) {
                return true
            }

            extra.push(detail_id)

            // 去除失效的内容ID
            extra = extra.filter(i => details.find(o => o.id == i))

            progress = ((extra.length / details.length) * 100).toFixed(2)

            uh.total_time = progress > 100 ? 100 : progress
            uh.extra = extra.join(',')
            return await uh.save()
        }

        // 不存在则创建
        progress = ((1 / details.length) * 100).toFixed(2)
        where.total_time = progress > 100 ? 100 : progress
        where.extra = detail_id
        return await app.model.UserHistory.create(where)
    }

    async update() {
        let { ctx, app } = this;

        const { type = 'course' } = ctx.request.body

        if (!(['course', 'column', 'book'].includes(type))) {
            ctx.throw(422, 'type值必须是 course,column,book 其中一个')
        }

        let result = null
        if (type == 'course') {
            result = await this.updateCourse()
        } else {
            result = await this.updateColumnOrBook()
        }

        ctx.apiSuccess(!!result)
    }
}

module.exports = User_historyController;