'use strict';

const Controller = require('./base');

class SchoolstaffController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Schoolstaff
    }

    async getListOptions() {
        let { ctx, app, service } = this;
        let currentUser = ctx.authUser;
        return {
            validate: {},
            limit: 10,
            options: {
                where: {
                    school_id: ctx.currentSchool.id
                },
                include: [{
                    model: app.model.User,
                    attributes: ['id', 'username', 'nickname', 'avatar']
                }],
                order: [
                    ['id', 'DESC']
                ]
            }
        }
    }

    // 返回列表数据之前
    async afterIndex(data) {
        let { ctx, app } = this
        let roles = await app.model.Role.findAll({
            attributes: ['id', 'name']
        })
        let r = {}
        roles = roles.forEach(o => {
            r[o.id] = {
                id: o.id,
                name: o.name
            }
        })

        return {
            total: data.count,
            items: data.rows.map(item => {
                item.roles = item.role_ids == '' ? [] : (item.role_ids.split(',')).map(k => r[k])
                return item
            }),
        }
    }

    get rules() {
        return {
            keyword: {
                type: 'string',
                required: true,
                desc: '关键词'
            },
        }
    }

    // 新增之前验证
    async beforeSave(data) {
        let { ctx, service, app } = this
        // 验证当前用户是否存在
        let user = await service.user.findByKeyword(data.keyword)

        let d = {
            user_id: user.id,
            school_id: ctx.currentSchool.id
        }

        // 员工是否已经存在
        if (await app.model.Schoolstaff.findOne({
                where: d
            })) {
            ctx.throw(422, '该用户已经是员工了')
        }

        return d
    }

    // 给员工设置角色
    async setRoles() {
        let { ctx, service, app } = this

        ctx.validate({
            id: {
                type: 'int',
                required: true,
                desc: '员工id'
            },
            role_ids: {
                type: 'array',
                required: true,
                desc: '角色ids'
            }
        })
        let { id, role_ids } = ctx.request.body

        ctx.apiSuccess(await service.schoolstaff.setRoles(id, role_ids))

    }

    // 获取当前员工所有权限和菜单
    async getAccesses() {
        let { ctx, service } = this
        ctx.apiSuccess(await service.schoolstaff.getAccessByStaffId(3))
    }


    // 删
    async delete() {
        let { ctx, app } = this;

        ctx.validate({
            staff_id: {
                type: "int",
                required: true,
                desc: "员工id"
            },
        });

        let { staff_id } = ctx.request.body;
        let { school_id } = ctx.header

        let where = {
            school_id,
            id: staff_id
        }

        let staff = await app.model.Schoolstaff.findOne({ where })

        if (!staff) {
            ctx.throw(400, '该员工不存在')
        }

        // 禁止删除网校创建人
        if (staff.iscreator) {
            ctx.throw(400, '禁止删除网校创建人')
        }

        // 禁止删除自己
        if (staff.user_id == ctx.authUser.id) {
            ctx.throw(400, '禁止删除自己')
        }

        ctx.apiSuccess(await this.model.destroy({ where }));
    }

}

module.exports = SchoolstaffController;