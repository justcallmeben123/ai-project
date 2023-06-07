'use strict';

const Controller = require('../admin/base');

class RoleController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Role
    }
    get rules() {
        return {
            name: {
                type: 'string',
                required: true,
                desc: '角色名称'
            },
            role_id: {
                type: 'string',
                required: true,
                desc: '角色标识'
            },
            desc: {
                type: 'string',
                required: false,
                desc: '备注'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1] },
                desc: '状态'
            }
        }
    }

    // 列表相关配置
    async getListOptions() {
        let { app } = this;
        return {
            validate: {},
            options: {
                include: [{
                    model: app.model.Access,
                    as: 'menus',
                    attributes: ['title'],
                    where: {
                        ismenu: 1,
                        status: 1
                    },
                    required: false
                }, {
                    model: app.model.Access,
                    as: 'accesses',
                    attributes: ['title'],
                    where: {
                        ismenu: 0,
                        status: 1
                    },
                    required: false
                }]
            }
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: data.rows.map(item => {
                item.menus = item.menus.map(v => v.title)
                item.accesses = item.accesses.map(v => v.title)
                return item
            })
        }
    }

    async beforeRead(opt) {
        let { app } = this
        opt.include = [{
            model: app.model.Access,
            as: 'menus',
            attributes: ['id', 'title', 'access_id'],
            where: {
                ismenu: 1,
                status: 1
            },
            required: false
        }, {
            model: app.model.Access,
            as: 'accesses',
            attributes: ['id', 'title', 'access_id'],
            where: {
                ismenu: 0,
                status: 1
            },
            required: false
        }]
        return opt
    }

    async afterRead(data) {
        data.menusId = data.menus.map(o => o.id)
        data.accessesId = data.accesses.map(o => o.id)
        data.menus = this.app.treeArray(data.menus)
        data.accesses = this.app.treeArray(data.accesses)
        return data
    }

    // 自定义参数验证
    async afterValidate(isUpdate) {
        let { ctx, app } = this
        let { id, role_id } = ctx.request.body

        let where = {
            role_id
        }

        if (isUpdate) {
            const Op = app.Sequelize.Op;
            where.id = {
                [Op.ne]: id
            }
        }

        // 验证是否已存在某个标识
        if ((await this.model.findOne({ where }))) {
            ctx.throw(422, '该标识已存在')
        }
    }
    
    // 更新之前查询
    async beforeUpdate() {
        let id = this.ctx.request.body.id
        if (id == 2 || id == 4) {
            this.ctx.throw(400, '禁止修改系统默认角色')
        }
        return await this.findOrFail(this.model, {
            id
        })
    }

    // 删除之前
    async beforeDelete(where) {
        const { ctx } = this
        const ids = ctx.request.body.ids
        if (ids.includes(2) || ids.includes(4)) {
            ctx.throw(400, '禁止删除系统默认角色')
        }
        return where
    }

    // 给角色设置权限
    async setRules() {
        let { ctx, app, service } = this

        ctx.validate({
            role_id: {
                type: "int",
                required: true,
                desc: "角色id"
            },
            access_ids: {
                type: "array",
                required: true,
                desc: "权限id"
            },
        });

        let { role_id, access_ids } = ctx.request.body;
        
        // 禁止修改系统默认角色
        if (role_id == 2 || role_id == 4) {
            return ctx.throw(400, '禁止修改系统默认角色')
        }

        // 角色ID是否存在
        let role = await app.model.Role.findOne({
            where: {
                id: role_id
            },
            attributes: ['id'],
            include: [{
                model: app.model.RoleAccess,
                attributes: ['access_id']
            }]
        })
        if (!role) {
            return ctx.throw(404, '当前角色不存在')
        }
        role = app.toArray(role)
        
        // 已经拥有的权限ID
        let has_ids = role.role_accesses.map(o => o.access_id)
        
        // 过滤权限ID：查询权限id，过滤当前角色权限
        let { add_ids, del_ids } = await service.access.filterIds(access_ids, has_ids)

        let addData = add_ids.map(access_id => {
                return {
                    access_id,
                    role_id
                }
            })
            
        let transaction;
        // 建立事务对象
        transaction = await app.model.transaction();
        
        try {
            // 删除
            await app.model.RoleAccess.destroy({
                where: {
                    access_id: del_ids,
                    role_id
                }
            },{ transaction })
    
            // 写入
            if (addData.length) {
                await app.model.RoleAccess.bulkCreate(addData,{ transaction })
            }
    
            // 提交事务
            await transaction.commit();
    
            ctx.apiSuccess('ok')
        } catch (err) {
            // 事务回滚
            await transaction.rollback();
            ctx.throw(400, err.message)
        }
        
    }
}

module.exports = RoleController;