'use strict';

const Controller = require('../base');

class ColumnController extends Controller {

    async index() {
        let { ctx, app } = this

        let school_id = ctx.currentSchool.id
        let where = {
            school_id,
            status: 1
        }

        let attributes = ["id", "title", "cover", "try", "price", "t_price"]
        let res = await this.list(app.model.Column, {
            where,
            attributes,
            order: [
                ['id', 'desc']
            ]
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                item.type = 'column'
                return item
            })
        })
    }

    // 查看专栏详情
    async read() {
        let { ctx, app, service } = this

        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: "专栏ID"
            },
            group_id: {
                type: "int",
                required: false,
                desc: "拼团ID"
            },
            flashsale_id: {
                type: "int",
                required: false,
                desc: "秒杀ID"
            }
        })

        let { id, group_id = 0, flashsale_id = 0 } = ctx.query

        let school_id = ctx.currentSchool.id
        let where = {
            id,
            school_id,
            status: 1
        }

        let res = await this.findOne(app.model.Column, {
            where,
            attributes: ["id", "title", "cover", "try", "content", "price", "t_price", "isend", "sub_count"],
            include: [{
                model: app.model.ColumnCourse,
                required: false,
                attributes: ['orderby'],
                include: [{
                    model: app.model.Course,
                    attributes: ["id", "title", "price", "type"],
                    where: {
                        status: 1
                    },
                    required: true,
                }],
            }],
            order: [
                [app.model.ColumnCourse, 'orderby', 'ASC'],
                [app.model.ColumnCourse, 'id', 'ASC']
            ]
        })

        res.isbuy = !!(await this.isbuy(id, 'column'))

        res.column_courses = res.column_courses.map(o => {
            return o.course
        })

        // 获取拼团
        if (group_id && group_id != 0) {
            res.group = await service.group.getGroup(group_id, 'column')
        }
        // 获取秒杀
        else if (flashsale_id && flashsale_id != 0) {
            res.flashsale = app.toArray(await service.flashsale.getFlashsale(flashsale_id, 'column'))
        }

        res.isfava = !!(await this.isfava(id, "column"))

        ctx.apiSuccess(res)
    }
}

module.exports = ColumnController;