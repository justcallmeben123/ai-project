'use strict';

const Service = require('egg').Service;

class SchoolstaffService extends Service {
    // 查询员工是否存在
    async isExist(id, school_id = 0, key = 'user_id') {
        let { ctx, app } = this;
        if (school_id == 0) {
            school_id = ctx.header.school_id
        }
        let d = await app.model.Schoolstaff.findOne({
            where: {
                school_id,
                [key]: id
            }
        })
        if (!d) {
            ctx.throw(404, '当前用户不是该网校员工')
        }

        // 当前员工
        ctx.currentStaff = d

        return d
    }

    // 给员工设置角色
    async setRoles(id, role_ids) {
        let { service, ctx } = this

        let staff = await this.isExist(id, ctx.header.school_id, 'id')

        role_ids = await service.role.filterIds(role_ids)

        staff.role_ids = role_ids.join(',')

        return await staff.save()
    }

    // 获取角色所有权限
    async getAccessByRole(role_ids) {
        let { ctx, app } = this

        let roles = await app.model.Role.findAll({
            where: {
                id: role_ids,
                status: 1
            },
            include: [{
                model: app.model.Access,
                as: 'menus',
                where: {
                    ismenu: 1,
                    status: 1
                },
                order: [
                    ['orderby', 'ASC'],
                    ['id', 'ASC'],
                ],
                required: false
            }, {
                model: app.model.Access,
                as: 'accesses',
                where: {
                    ismenu: 0,
                    status: 1
                },
                order: [
                    ['orderby', 'ASC'],
                    ['id', 'ASC'],
                ],
                required: false
            }],
            attributes: ['id', 'name', 'role_id']
        })

        roles = app.toArray(roles)

        let menus = []
        let menusIds = []
        let simple_menus = []
        let accesses = []
        let accessesIds = []
        let simple_accesses = []
        let roleKeys = []

        roles.forEach(item => {
            roleKeys.push(item.role_id)
            item.menus.forEach(o => {
                if (!menusIds.includes(o.id)) {
                    menus.push({
                        id: o.id,
                        access_id: o.access_id,
                        name: o.content,
                        hidden: !!o.hidden,
                        title: o.title,
                    })
                    simple_menus.push(o.content)
                    menusIds.push(o.id)
                }
            })

            item.accesses.forEach(o => {
                if (!accessesIds.includes(o.id)) {
                    // accesses.push({
                    //     id: o.id,
                    //     title: o.title,
                    //     access_id: o.access_id,
                    //     content: o.content,
                    //     method: o.method,
                    // })
                    simple_accesses.push(o.content + ',' + o.method)
                    accessesIds.push(o.id)
                }
            })
        })

        return {
            menus: app.treeArray(menus, 0),
            // accesses,
            simple_menus,
            simple_accesses,
            roleKeys
        }
    }

    // 获取员工的所有菜单和权限
    async getAccessByStaffId(st, school_id = 0) {
        let { ctx, app } = this

        let staff = null

        if (typeof st == 'number') {
            if (school_id == 0) {
                school_id = ctx.header.school_id
            }
            // 获取员工角色
            staff = await app.model.Schoolstaff.findOne({
                where: {
                    id: st,
                    school_id
                },
                attributes: ['role_ids', 'iscreator']
            })
        } else {
            staff = st
        }

        let role_ids = staff.role_ids.split(',')
            // 是否是网校创建人
        if (staff.iscreator) {
            // 获取超级管理员角色id
            role_ids = [2]
        }
        return await this.getAccessByRole(role_ids)
    }

    // 根据用户id获取权限菜单
    async getAccessByUid(user_id) {
        let staff = await this.isExist(user_id)
        return await this.getAccessByStaffId(staff)
    }

    // 判断当前用户是否拥有请求权限
    async hasAccessByUid(user_id, url = false, method = false) {

            let staff = await this.isExist(user_id)

            return await this.staffHasAccess(staff.id, url, method)
        }
        // 判断当前员工是否拥有请求权限
    async staffHasAccess(staff_id, url = false, method = false) {
        let { ctx } = this

        // 获取当前员工所拥有的权限
        let { simple_accesses } = await this.getAccessByStaffId(staff_id)

        url = url ? url : ctx.request.url
        method = method ? method : ctx.request.method
        url = url.indexOf("?") != -1 ? url.split("?")[0] : url
        
        return simple_accesses.includes(url + ',' + method)
    }


}

module.exports = SchoolstaffService;