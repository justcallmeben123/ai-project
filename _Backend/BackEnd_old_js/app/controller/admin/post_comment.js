'use strict';

const Controller = require('./base');

class Post_commentController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.PostComment
    }

    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            post_id: ctx.query.post_id,
            school_id: ctx.header.school_id
        }

        return {
            validate: {
                post_id: {
                    required: true,
                    desc: "帖子ID",
                    type: "int"
                }
            },
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.User,
                    attributes: ['id', 'username', 'avatar', 'nickname']
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
                if (item.reply_user) {
                    item.reply_user = JSON.parse(item.reply_user)
                }
                return item
            }),
        }
    }

    async delete() {
        let { ctx, app, service } = this;

        ctx.validate({
            ids: {
                type: "array",
                required: true,
                desc: "ids"
            },
            post_id: {
                required: true,
                desc: "帖子ID",
                type: "int"
            }
        });

        let { ids, post_id } = ctx.request.body;
        if(this.ctx.header.school_id == 11){
            this.ctx.throw(400, '演示数据，禁止删除')
        }
        ctx.apiSuccess(await this.model.destroy({
            where: {
                id: ids,
                post_id,
                school_id: ctx.header.school_id
            }
        }));
    }
}

module.exports = Post_commentController;