'use strict';

const Controller = require('./base');

class Column_courseController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.ColumnCourse
    }

    async getListOptions() {
        let { ctx, service, app } = this;
        let { column_id } = ctx.query

        // 查询专栏id是否存在
        if (column_id == undefined) {
            ctx.throw(422, '专栏ID必填')
        }
        await service.column.isExist(parseInt(column_id))

        return {
            validate: {},
            limit: 200,
            options: {
                where: {
                    column_id
                },
                include: [{
                    model: app.model.Course,
                    attributes: ['title', 'cover', 'price', 't_price', 'status', 'type'],
                }],
                order: [
                    ['orderby', 'ASC'],
                    ['id', 'ASC']
                ]
            }
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: data.rows.map(item => {
                return {
                    course_id: item.course_id,
                    title: item.course.title,
                    cover: item.course.cover,
                    price: item.course.price,
                    t_price: item.course.t_price,
                    status: item.course.status,
                    type: item.course.type,
                    id: item.id,
                    sub_count: item.look_count,
                    orderby: item.orderby,
                }
            })
        }
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            column_id: {
                type: 'int',
                required: true,
                desc: '专栏ID'
            },
            course_id: {
                type: 'int',
                required: true,
                desc: '课程ID'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { ctx, app, service } = this

        if(data.column_id == 3){
            ctx.throw(400,'为了防止该专栏数据被破坏，请操作其他专栏')
        }

        // 查询专栏id是否存在
        await service.column.isExist(data.column_id)

        // 查询课程id是否存在
        await service.course.isExist(data.course_id)

        return data
    }

    // 验证专栏ID和过滤前端传来的目录id
    async checkColumnIdAndFilterIds() {
        let { ctx, app, service } = this

        ctx.validate({
            ids: {
                type: "array",
                required: true,
                desc: "ids"
            },
            column_id: {
                type: "int",
                required: true,
                desc: "专栏ID"
            }
        })

        let { ids, column_id } = ctx.request.body

        // 查询专栏id是否存在
        await service.column.isExist(column_id)

        let menus = await app.model.ColumnCourse.findAll({
            where: {
                column_id
            },
            attributes: ['id']
        })

        // 获取已有的目录id
        let menuIds = (app.toArray(menus)).map(o => o.id)

        // 过滤数据
        let updateIds = []
        ids.forEach(id => {
            if (menuIds.includes(id) && !updateIds.includes(id)) {
                updateIds.push(id)
            }
        })

        return updateIds
    }

    async sort() {
        let { ctx, app } = this

        // 过滤数据
        let updateData = await this.checkColumnIdAndFilterIds()

        updateData = updateData.map((id, orderby) => {
            return {
                id,
                orderby
            }
        })

        // 批量更新数据
        let res = await app.model.ColumnCourse.bulkCreate(updateData, {
            updateOnDuplicate: ["orderby"]
        })
        ctx.apiSuccess(res)
    }

    async delete() {
        let { ctx, app, service } = this;

        let ids = await this.checkColumnIdAndFilterIds()

        if(ctx.request.body.column_id == 3){
            ctx.throw(400,'为了防止该专栏数据被破坏，请操作其他专栏')
        }

        ctx.apiSuccess(await this.model.destroy({
            where: {
                id: ids
            }
        }));
    }

}

module.exports = Column_courseController;