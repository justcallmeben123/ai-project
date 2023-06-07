'use strict';

const Service = require('egg').Service;

class PlatformstaffService extends Service {
    // 查询员工是否存在
    async isExist(id, key = 'user_id') {
        let { ctx, app } = this;
        let d = await app.model.Platformstaff.findOne({
            where: {
                [key]: id
            }
        })
        if (!d) {
            ctx.throw(404, '当前用户不是该平台人员')
        }

        // 当前平台人员
        ctx.currentPlatformstaff = d

        return d
    }

    // 判断当前用户是否拥有请求权限
    async hasAccessByUid(user_id, url = false, method = false) {

        let staff = await this.isExist(user_id)

        if (staff.issuper) {
            return true
        }

        // 其他验证
        return true

        // return await this.staffHasAccess(staff.id, url, method)
    }

    // 判断当前员工是否拥有请求权限
    // async staffHasAccess(staff_id, url = false, method = false) {
    //     let { ctx } = this

    //     // 获取当前员工所拥有的权限
    //     let { simple_accesses } = await this.getAccessByStaffId(staff_id)

    //     url = url ? url : ctx.request.url
    //     method = method ? method : ctx.request.method
    //     url = url.indexOf("?") != -1 ? url.split("?")[0] : url
    //     return simple_accesses.includes(url + ',' + method)
    // }
}

module.exports = PlatformstaffService;