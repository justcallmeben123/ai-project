'use strict';
const Controller = require('./base');
class SchoolController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.School
    }

    // 验证规则
    get rules() {
        return {
            name: {
                type: 'string',
                required: true,
                desc: '网校标题'
            },
        }
    }


    // 查
    async list() {
        let { ctx, app, service } = this;
        // 获取列表相关配置
        ctx.validate({
            page: {
                required: false,
                desc: "页码",
                type: "int",
                defValue: 1
            },
            limit: {
                required: false,
                type: "int",
                defValue: 10
            }
        });
        // 分页
        let rows = await this.page(app.model.Schoolstaff, {
            where: {
                user_id: ctx.authUser.id
            },
            include: [{
                model: app.model.School
            }],
            attributes: ['id'],
            order: [
                ['id', 'DESC']
            ]
        })
        rows = app.toArray(rows)
        rows.rows = rows.rows.map(o => {
            return {
                ...o.school
            }
        })
        ctx.apiSuccess(await this.afterIndex(rows));
    }


    async beforeRead(opt) {
        let { app } = this
        opt.include = [{
            model: app.model.User,
            attributes: ['id', 'username', 'nickname', 'phone', 'email']
        }]
        return opt
    }

    async afterRead(data) {
        data.weburl = `http://ceshi8.dishaxy.com/school/${data.id}`
        return data
    }

    // 新增之前数据处理
    async beforeSave(data) {
        return {
            ...data,
            user_id: this.ctx.authUser.id,
            appid: this.ctx.genID()
        }
    }
    // 新增之后
    async afterSave(data) {
        let { app, ctx } = this
        let currentUser = ctx.authUser;
        await app.model.Schoolstaff.create({
            user_id: currentUser.id,
            school_id: data.id,
            iscreator: 1
        })
        
        // 初始化网校，默认创建PC端和移动端首页
        await app.model.Renovation.bulkCreate([{
            school_id: data.id,
            title: "首页",
            isdefault: 1,
            type: "index",
            ismobile: 1
        }, {
            school_id: data.id,
            title: "首页",
            isdefault: 1,
            type: "index",
            ismobile: 0
        }])
        
        return data
    }
    // 更新之前查询
    async beforeUpdate() {
        let { ctx, app, service } = this;
        let currentUser = ctx.authUser;
        let { school_id } = ctx.header
        return await this.findOrFail(this.model, {
            id: school_id,
            user_id: currentUser.id
        })
    }
    // 删除之前
    async beforeDelete(where) {
        return {
            ...where,
            user_id: this.ctx.authUser.id
        }
    }
}

module.exports = SchoolController;