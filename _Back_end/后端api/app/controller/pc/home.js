'use strict';
const Controller = require('../base');
class HomeController extends Controller {
    // app首页列表数据
    async index() {
        let { ctx, app } = this

        let school_id = ctx.currentSchool.id

        let r = await app.model.Renovation.findOne({
            where: {
                school_id,
                type: "index",
                ismobile: 0
            },
            attributes: ['template']
        })

        ctx.apiSuccess(JSON.parse(r.template))
    }

    // 搜索
    async search() {
        let { ctx, app } = this

        let school_id = ctx.currentSchool.id
        let where = {
            school_id,
            status: 1
        }

        let { keyword, type } = ctx.query
            // 关键词
        if (keyword != undefined && keyword != '') {
            const Op = app.Sequelize.Op
            where.title = {
                [Op.like]: `%${keyword}%`
            }
        }

        let Model = type == 'column' ? 'Column' : 'Course'
        let attributes = ["id", "title", "cover", "try", "price", "t_price"]
        if (Model == 'Course') {
            attributes.push('type')
        }
        let res = await this.list(app.model[Model], {
            where,
            attributes
        }, {
            keyword: {
                type: 'string',
                required: true,
                desc: '搜索关键词'
            },
            type: {
                type: 'string',
                required: true,
                range: { in: ['course', 'column']
                },
                desc: '类型'
            },
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => {
                return {
                    id: item.id,
                    title: item.title || 'null',
                    cover: item.cover || 'null',
                    price: item.price,
                    t_price: item.price,
                    type: type == 'column' ? 'column' : item.type,
                }
            })
        })
    }
}

module.exports = HomeController;