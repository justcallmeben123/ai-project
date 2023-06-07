'use strict';

const Controller = require('./base');

class BbsController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Bbs
    }

    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }

        return {
            validate: {},
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.User,
                    as: 'managers',
                    attributes: ['id', 'username', 'avatar', 'nickname']
                }],
                order: [
                    ['id', 'DESC']
                ]
            }
        }
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            title: {
                type: 'string',
                required: true,
                desc: '社区标题'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '状态'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { school_id } = this.ctx.header
        return {
            ...data,
            school_id
        }
    }

    // 更新之前查询
    async beforeUpdate() {
        let { ctx, app, service } = this;
        let { id } = ctx.request.body
        let { school_id } = ctx.header
        this.testThrow(id) 
        return await this.findOrFail(this.model, {
            id,
            school_id
        })
    }

    // 删除之前
    async beforeDelete(where) {
        where.school_id = this.ctx.header.school_id
        if(this.ctx.header.school_id == 11){
            this.ctx.throw(400, '演示数据，禁止删除')
        }
        this.testThrow(id) 
        return where
    }

    // 给社区设置管理员
    async setManagers() {
        let { ctx, service, app } = this

        ctx.validate({
            id: {
                type: 'int',
                required: true,
                desc: '社区ID'
            },
            user_ids: {
                type: 'array',
                required: true,
                desc: '用户ids'
            }
        })
        let { id, user_ids } = ctx.request.body

        let bbs = await service.bbs.isExist(id)
        
        this.testThrow(id) 

        // 过滤有效用户id
        user_ids = await service.user.filterIds(user_ids)

        // 已经存在的用户id
        let hasIds = bbs.bbs_managers.map(o => o.user_id)

        // 需要删除
        let delUserIds = hasIds.filter(id => !user_ids.includes(id))

        // 需要添加
        let addUserIds = user_ids.filter(id => !hasIds.includes(id))

        // 删除
        await app.model.BbsManager.destroy({
                where: {
                    user_id: delUserIds,
                    bbs_id: id
                }
            })
            // 新增
        await app.model.BbsManager.bulkCreate(addUserIds.map(user_id => {
            return {
                user_id,
                bbs_id: id
            }
        }))

        ctx.apiSuccess('ok')

    }
    
     // 演示数据禁止操作
    testThrow(id, msg = '演示数据，禁止操作'){
        if(this.ctx.request.header['x-real-ip'] == '120.235.155.164') return
        let ids = [65,66,67,68,69,70,71,72]
        if(ids.includes(id)){
            this.ctx.throw(400, msg)
        }
    }

}

module.exports = BbsController;