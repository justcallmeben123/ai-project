'use strict';

const Controller = require('./base');

class PostController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Post
    }

    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            bbs_id: ctx.query.bbs_id
        }

        return {
            validate: {
                bbs_id: {
                    required: true,
                    desc: "社区ID",
                    type: "int"
                }
            },
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.User,
                    attributes: ['id', 'username', 'avatar', 'nickname']
                }, {
                    model: app.model.Bbs,
                    as: "bbs",
                    where: {
                        school_id: ctx.header.school_id,
                        id: ctx.query.bbs_id
                    },
                    attributes: ['id']
                }],
                order: [
                    ['id', 'DESC']
                ]
            }
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: data.rows.map(item => {
                item.content = item.content ? JSON.parse(item.content) : []
                delete item.bbs
                return item
            }),
        }
    }

    // 置顶/取消
    async updateIsTop() {
        let { ctx, app, service } = this
        ctx.validate({
            id: {
                required: true,
                desc: "ID",
                type: "int"
            },
            is_top: {
                required: true,
                desc: "置顶状态",
                type: "int",
                range: { in: [0, 1]
                }
            }
        })

        let { id, is_top } = ctx.request.body

        let M = await this.findOrFail(this.model, { id })

        await service.bbs.isExist(M.bbs_id)

        M.is_top = is_top

        ctx.apiSuccess(await M.save());
    }

    async delete() {
        let { ctx, app, service } = this;

        ctx.validate({
            ids: {
                type: "array",
                required: true,
                desc: "ids"
            },
            bbs_id: {
                required: true,
                desc: "社区ID",
                type: "int"
            }
        });

        let { ids, bbs_id } = ctx.request.body;

        await service.bbs.isExist(bbs_id)
        if(this.ctx.header.school_id == 11){
            this.ctx.throw(400, '演示数据，禁止删除')
        }
        let where = await this.beforeDelete({ id: ids, bbs_id })

        ctx.apiSuccess(await this.model.destroy({ where }));
    }

}

module.exports = PostController;