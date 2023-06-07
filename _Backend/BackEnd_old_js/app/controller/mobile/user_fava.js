'use strict';

const Controller = require('../base');

class User_favaController extends Controller {
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            user_id: ctx.authUser.id,
        }

        let res = await this.list(app.model.UserFava, {
            where,
            include: [{
                model: app.model.Course,
                attributes: ['id', 'title', 'cover', 'try', 'type'],
            }, {
                model: app.model.Column,
                attributes: ['id', 'title', 'cover', 'try'],
            }],
            attributes: ['id', 'type'],
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                let c = item[item.type] || {}
                item.goods = Object.assign({
                    id: c.id,
                    title: c.title || '已被删除',
                    cover: c.cover,
                    try: c.try ? c.try.replace(/<\/?.+?>/g, "") : '无',
                    type: c.type || item.type
                }, {})
                delete item.course
                delete item.column
                return item
            })
        })
    }

    // 收藏
    async save() {
        let { ctx, app } = this;
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id;

        ctx.validate({
            goods_id: {
                type: "int",
                required: true,
                desc: "课程/专栏id"
            },
            type: {
                type: "string",
                required: true,
                desc: "类型",
                range: { in: ['course', 'column']
                }
            },
        })

        const { goods_id, type } = ctx.request.body

        // 课程/专栏不存在
        let M = type == 'course' ? 'Course' : 'Column'
        let g = await app.model[M].findOne({
            where: {
                school_id,
                id: goods_id,
                status: 1
            }
        })
        if (!g) {
            ctx.throw(400, '该课程/专栏不存在')
        }

        // 已收藏
        let where = {
            school_id,
            user_id,
            goods_id,
            type,
        }
        let user_fava = await app.model.UserFava.findOne({
            where
        })
        if (user_fava) {
            ctx.throw(400, '你已经收藏过了')
        }

        let res = await app.model.UserFava.create({
            school_id,
            user_id,
            goods_id,
            type,
        })
        ctx.apiSuccess('ok');
    }

    // 取消收藏
    async delete() {
        let { ctx, app } = this;
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id;
        let { type } = ctx.request.body
        let d = {
            book: "电子书ID",
            course: "课程ID",
            column: "专栏ID"
        }
        let goodsIdDesc = d[type]
        ctx.validate({
            goods_id: {
                type: "int",
                required: true,
                desc: goodsIdDesc
            },
            type: {
                type: "string",
                required: true,
                desc: "类型",
                range: { in: ['course', 'column', 'book']
                }
            }
        });

        let { goods_id } = ctx.request.body;

        let res = await app.model.UserFava.destroy({
            where: {
                goods_id,
                type,
                user_id,
                school_id
            }
        })

        ctx.apiSuccess(res);
    }
}

module.exports = User_favaController;