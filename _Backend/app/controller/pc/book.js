'use strict';

const Controller = require('../base');

class BookController extends Controller {
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            status: 1
        }
        
        // 演示数据，可以删除
        if(ctx.currentSchool.id == 11){
            where.id = {
                [app.Sequelize.Op.in]: [27,28,29,30,31,32]
            }
        }

        let res = await this.list(app.model.Book, {
            where,
            attributes: ["id", "title", "cover", "desc", "price", "t_price", "sub_count"],
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows
        })
    }

    // 查看电子书详情
    async read() {
        let { ctx, app } = this

        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: "电子书ID"
            },
        })

        let { id } = ctx.query

        let school_id = ctx.currentSchool.id
        let where = {
            id,
            school_id,
            status: 1
        }

        let res = await this.findOne(app.model.Book, {
            where,
            attributes: ["id", "title", "cover", "desc", "try", "price", "t_price", "sub_count"],
            include: [{
                model: app.model.BookDetail,
                required: false,
                attributes: ['orderby', 'title', 'isfree', 'id'],
            }],
            order: [
                [app.model.BookDetail, 'orderby', 'ASC']
            ]
        })

        res.isbuy = !!(await this.isbuy(id, 'book'))

        res.isfava = !!(await this.isfava(id, 'book'))

        ctx.apiSuccess(res)
    }

    // 查看电子书章节列表和内容
    async detail() {
        let { ctx, app } = this

        ctx.validate({
            book_id: {
                type: "int",
                required: true,
                desc: "电子书ID"
            },
            id: {
                type: "int",
                required: true,
                desc: "电子书内容ID"
            }
        })

        let { book_id, id } = ctx.query

        let res2 = await this.findOne(app.model.BookDetail, {
            where: {
                id,
                book_id
            },
            attributes: ['title', 'content', 'isfree']
        })

        // let res = await this.findOne(app.model.Book, {
        //     where: {
        //         id: book_id,
        //         school_id: ctx.currentSchool.id,
        //         status: 1
        //     },
        //     attributes: ["id", "title", "cover"],
        //     include: [{
        //         model: app.model.BookDetail,
        //         required: false,
        //         attributes: ['orderby', 'title', 'isfree', 'id'],
        //     }],
        //     order: [
        //         [app.model.BookDetail, 'orderby', 'ASC'],
        //         [app.model.BookDetail, 'id', 'ASC'],
        //     ]
        // })

        if (!res2.isfree) {
            let isbuy = !!(await this.isbuy(book_id, 'book'))
            if (!isbuy) {
                ctx.throw(400, '请先购买该电子书')
            }
        }

        // res2.menus = res.book_details
        // res2.detail = {
        //     id: res.id,
        //     title: res.title,
        //     cover: res.cover
        // }
        ctx.apiSuccess(res2)
    }
    
    // 电子书目录
    async menus() {
        let { ctx, app } = this

        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: "电子书ID"
            }
        })

        let { id } = ctx.query

        let res = await this.findOne(app.model.Book, {
            where: {
                id: id,
                school_id: ctx.currentSchool.id,
                status: 1
            },
            attributes: ["id", "title", "cover"],
            include: [{
                model: app.model.BookDetail,
                required: false,
                attributes: ['orderby', 'title', 'isfree', 'id'],
            }],
            order: [
                [app.model.BookDetail, 'orderby', 'ASC'],
                [app.model.BookDetail, 'id', 'ASC'],
            ]
        })

        ctx.apiSuccess({
            detail:{
                id: res.id,
                title: res.title,
                cover: res.cover
            },
            menus:res.book_details
        })
    }

    async myBook() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id
        let where = {
            school_id,
            user_id,
            type: "book"
        }

        let res = await this.list(app.model.OrderItem, {
            where,
            attributes: ["id"],
            include: [{
                model: app.model.Book,
                where: {
                    status: 1
                },
                required: true,
                attributes: ["id", "title", "cover", "desc"]
            },{
                model: app.model.Order,
                where: {
                    status: "success"
                },
                required: true,
                attributes: ["id", "status"]
            }],
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(o => {
                let b = o.book || {}
                return {
                    id: b.id,
                    title: b.title || '该电子书已被删除',
                    cover: b.cover,
                    desc: b.desc,
                }
            })
        })
    }
}

module.exports = BookController;