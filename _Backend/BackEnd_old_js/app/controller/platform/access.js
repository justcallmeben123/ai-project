'use strict';

const Controller = require('../admin/base');

class AccessController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Access
    }

    // 列表相关配置
    async getListOptions() {
        let { ctx, app, service } = this;
        let ismenu = ctx.query.type == 'rule' ? 0 : 1
        let options = {
            where: {
                ismenu,
            },
            order: [
                ['orderby', 'ASC'],
                ['id', 'ASC'],
            ]
        }
        return {
            validate: {
                type: {
                    type: 'string',
                    required: false,
                    range: { in: ['rule', 'menu'] },
                    desc: '类型'
                }
            },
            limit: 100,
            options
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: this.app.treeArray(data.rows, 0)
        }
    }

    get rules() {
        let { ctx } = this;
        let t = ctx.request.body.ismenu == 1 ? '菜单' : '权限'
        return {
            title: {
                type: 'string',
                required: true,
                desc: t + '标题'
            },
            access_id: {
                type: 'int',
                required: true,
                desc: '上级' + t + 'id'
            },
            content: {
                type: 'string',
                required: true,
                desc: t + '内容'
            },
            method: {
                type: 'string',
                required: false,
                desc: '请求方式'
            },
            ismenu: {
                type: 'int',
                required: true,
                range: { in: [0, 1] },
                desc: '是否是菜单'
            },
            hidden: {
                type: 'int',
                required: false,
                range: { in: [0, 1] },
                desc: '是否隐藏'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1] },
                desc: '状态'
            },
            orderby: {
                type: 'int',
                required: true,
                desc: '排序'
            }
        }
    }
}

module.exports = AccessController;