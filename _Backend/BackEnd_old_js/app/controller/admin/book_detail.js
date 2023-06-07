'use strict';

const Controller = require('./base');

class Book_detailController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.BookDetail
    }

    async getListOptions() {
        let { ctx, service, app } = this;
        let { book_id } = ctx.query

        // 查询电子书id是否存在
        if (book_id == undefined) {
            ctx.throw(422, '电子书ID必填')
        }
        await service.book.isExist(parseInt(book_id))

        return {
            validate: {},
            limit: 200,
            options: {
                where: {
                    book_id
                },
                attributes: ['id', 'title', 'content', 'isfree', 'orderby'],
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
                return item
            })
        }
    }


    // 验证规则
    async formRules(isUpdate = 0) {
        let r = {
                book_id: {
                    type: 'int',
                    required: true,
                    desc: '电子书ID'
                },
                title: {
                    type: 'string',
                    required: true,
                    desc: '章节标题'
                },
                isfree: {
                    type: 'int',
                    required: true,
                    range: { in: [0, 1]
                    },
                    desc: '是否免费试看'
                },
            }
            // 更新
        if (isUpdate) {
            return {
                ...r,
                id: {
                    type: "int",
                    required: true,
                    desc: "ID"
                },
                content: {
                    type: 'string',
                    required: true,
                    desc: '章节内容'
                }
            }
        }
        return r
    }

    // 新增之前
    async beforeSave(data) {
        let { ctx, app, service } = this

        // 查询电子书id是否存在
        await service.book.isExist(data.book_id)

        return data
    }

    // 更新之前查询
    async beforeUpdate() {
        let { ctx, service } = this
        let { id, book_id } = ctx.request.body
            // 当前网校电子书id是否存在
        await service.book.isExist(book_id)

        let d = await this.findOrFail(this.model, {
            id,
            book_id
        })

        return d
    }

    // 验证电子书ID和过滤前端传来的目录id
    async checkBookIdAndFilterIds() {
        let { ctx, app, service } = this

        ctx.validate({
            ids: {
                type: "array",
                required: true,
                desc: "ids"
            },
            book_id: {
                type: "int",
                required: true,
                desc: "电子书ID"
            }
        })

        let { ids, book_id } = ctx.request.body

        // 查询电子书id是否存在
        await service.book.isExist(book_id)

        let menus = await app.model.BookDetail.findAll({
            where: {
                book_id
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
        let updateData = await this.checkBookIdAndFilterIds()

        updateData = updateData.map((id, orderby) => {
            return {
                id,
                orderby
            }
        })

        // 批量更新数据
        let res = await app.model.BookDetail.bulkCreate(updateData, {
            updateOnDuplicate: ["orderby"]
        })
        ctx.apiSuccess(res)
    }

    async delete() {
        let { ctx, app, service } = this;

        let ids = await this.checkBookIdAndFilterIds()

        ctx.apiSuccess(await this.model.destroy({
            where: {
                id: ids,
                book_id: ctx.request.body.book_id
            }
        }));
    }

}

module.exports = Book_detailController;