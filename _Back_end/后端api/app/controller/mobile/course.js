'use strict';

const Controller = require('../base');

class CourseController extends Controller {
    async index() {
        let { ctx, app } = this

        let school_id = ctx.currentSchool.id
        let where = {
            school_id,
            status: 1
        }
        let attributes = ["id", "title", "cover", "try", "price", "t_price", 'type']
        let res = await this.list(app.model.Course, {
            where,
            attributes,
            order: [
                ['id', 'desc']
            ]
        })

        ctx.apiSuccess(res)
    }

    // 查看课程详情
    async read() {
        let { ctx, app, service } = this

        let { id, column_id = 0, group_id = 0, flashsale_id = 0 } = ctx.query

        let school_id = ctx.currentSchool.id
        let type = column_id && column_id != 0 ? 'column' : 'course'

        let res = await this.findOne(app.model.Course, {
            where: {
                id,
                school_id,
                status: 1
            },
            attributes: ["id", "title", "cover", "try", "price", "t_price", "type", "sub_count", "content"]
        })

        let isbuy = false
        if (type == 'column') {
            column_id = parseInt(column_id)
            if (!!(await this.isbuy(column_id, 'column'))) {
                isbuy = !!(await app.model.ColumnCourse.findOne({
                    where: {
                        column_id,
                        course_id: id
                    },
                    attributes: ['id']
                }))
            }
        } else {
            isbuy = !!(await this.isbuy(id, 'course'))
        }

        // 专栏试看课程
        if (type == 'column' && res.price == 0) {
            isbuy = true
        }

        res.isbuy = isbuy

        if (!res.isbuy) {
            delete res.content
        }

        // 获取拼团
        if (group_id && group_id != 0) {
            res.group = await service.group.getGroup(group_id, type)
        }
        // 获取秒杀
        else if (flashsale_id && flashsale_id != 0) {
            res.flashsale = app.toArray(await service.flashsale.getFlashsale(flashsale_id, type))
        }

        res.isfava = !!(await this.isfava(type == 'column' ? column_id : id, type))

        ctx.apiSuccess(res)
    }

}

module.exports = CourseController;