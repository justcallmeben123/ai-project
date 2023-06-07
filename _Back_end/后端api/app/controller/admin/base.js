'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
    get model() {
        return null
    }
    async getListOptions() {
        let { ctx, app, service } = this;
        let currentUser = ctx.authUser;
        return {
            validate: {},
            limit: 10,
            options: {
                where: {},
                order: [
                    ['id', 'DESC']
                ]
            }
        }
    }
    get rules() {
            return {}
        }
        // 验证规则
    async formRules(isUpdate = 0) {
        let r = this.rules
            // 更新
        if (isUpdate) {
            r.id = {
                type: "int",
                required: true,
                desc: "ID"
            }
        }
        return r
    }
    get validateOptions() {
            return {}
        }
        // 参数验证其他参数配置
    async formOptions(isUpdate = 0) {
        let opt = this.validateOptions
            // 更新
        if (isUpdate) {

        }
        return opt
    }
    // 查
    async list() {
        let { ctx, app, service } = this;
        // 获取列表相关配置
        let { validate, options, limit } = await this.getListOptions()
        ctx.validate({
            ...validate,
            page: {
                required: false,
                desc: "页码",
                type: "int",
                defValue: 1
            },
            limit: {
                required: false,
                type: "int",
                defValue: limit || 10
            }
        });
        // 分页
        let rows = await this.page(this.model, options)
        rows = app.toArray(rows)
        ctx.apiSuccess(await this.afterIndex(rows));
    }

    // 返回列表数据之前
    async afterIndex(data) {
        return {
            total: data.count,
            items: data.rows
        }
    }

    // 分页
    async page(model, options) {
        let { ctx, app, service } = this;
        let page = ctx.query.page ? parseInt(ctx.query.page) : 1;
        let limit = ctx.query.limit ? parseInt(ctx.query.limit) : 10;
        let offset = (page - 1) * limit;

        return await model.findAndCountAll({
            offset,
            limit,
            ...options,
            distinct: true
        });
    }

    // 查询单条数据
    async read() {
        let { ctx, app, service } = this;
        ctx.validate({
            id: {
                required: true,
                desc: "ID",
                type: "int"
            },
        })

        let { id } = ctx.query

        let opt = await this.beforeRead({
            where: {
                id
            },
        })

        let res = await this.model.findOne(opt)

        if (!res) {
            ctx.throw(404, '该记录不存在')
        }

        ctx.apiSuccess(await this.afterRead(app.toArray(res)));
    }

    // 查询单个之前
    async beforeRead(opt) {
        return opt
    }

    // 查询单个返回数据处理
    async afterRead(data) {
        return data
    }

    // 写入数据库前参数验证
    async formValidate(isUpdate = 0) {
        this.ctx.validate(await this.formRules(isUpdate), await this.formOptions(isUpdate));
        await this.afterValidate(isUpdate)
    }
    // 自定义参数验证
    async afterValidate(isUpdate) {

    }
    // 增
    async save() {
        let { ctx, app } = this;
        let currentUser = ctx.authUser;

        await this.formValidate()
            // 新增前数据处理
        let data = await this.beforeSave(this.ctx.request.body)

        let res = await this.model.create(data)
        res = JSON.parse(JSON.stringify(res))
            // 新增后数据处理
        ctx.apiSuccess(await this.afterSave(res));
    }
    // 新增之前
    async beforeSave(data) {
        return data
    }
    // 新增之后
    async afterSave(data) {
        return data
    }

    // 查询是否存在，不存在则报错
    async findOrFail(model, where = {}, options = {}) {
        let { ctx, app } = this;
        let M = await model.findOne({
            where,
            ...options
        });

        if (!M) {
            ctx.throw(404, '该记录不存在');
        }

        return M
    }
    // 改
    async update() {
        let { ctx } = this;
        await this.formValidate(1)

        // 更新之前查询
        let M = await this.beforeUpdate()

        delete ctx.request.body.id

        let res = await M.update({
            ...ctx.request.body
        });

        ctx.apiSuccess(await this.afterUpdate(res));
    }
    // 更新之前查询
    async beforeUpdate() {
        return await this.findOrFail(this.model, {
            id: this.ctx.request.body.id
        })
    }
    // 新增之后
    async afterUpdate(data) {
        return data
    }

    // 更新指定字段
    async updateByKey(k = 'status', desc = '状态') {
        let { ctx, app } = this
        ctx.validate({
            id: {
                required: true,
                desc: "ID",
                type: "int"
            },
            [k]: {
                required: true,
                desc,
                type: "int",
                range: { in: [0, 1]
                }
            }
        })

        let { id } = ctx.request.body
        let { school_id } = ctx.header

        let where = { id }

        if (school_id) {
            where.school_id = school_id
        }

        let M = await this.findOrFail(this.model, where)

        M = await this.beforeUpdateByKey(M, k)

        M[k] = ctx.request.body[k]

        ctx.apiSuccess(await M.save());
    }

    // 更新指定字段之前
    async beforeUpdateByKey(M, key = 'status') {
        return M
    }

    // 上架下架
    async updateStatus() {
        await this.updateByKey('status')
    }

    // 删
    async delete() {
        let { ctx, app } = this;

        ctx.validate({
            ids: {
                type: "array",
                required: true,
                desc: "ids"
            },
        });

        let { ids } = ctx.request.body;

        let where = await this.beforeDelete({ id: ids })

        ctx.apiSuccess(await this.model.destroy({ where }));
    }
    // 删除之前
    async beforeDelete(where) {
        if(this.ctx.header.school_id == 11){
            this.ctx.throw(400,'禁止删除演示数据')
        }
        return where
    }

    // 验证开始和结束时间
    async validateStartTimeAndEndTime() {
        let { ctx, app } = this
        let { start_time, end_time } = ctx.request.body

        // 校验日期时间格式
        let msg = '时间格式必须为：YYYY-MM-DD hh:mm:ss'
        if (!app.strDateTime(start_time)) {
            ctx.throw(422, '开始' + msg)
        }

        if (!app.strDateTime(end_time)) {
            ctx.throw(422, '结束' + msg)
        }

        if (new Date(start_time) <= (new Date())) {
            ctx.throw(422, '开始时间 必须大于 当前时间')
        }

        if (new Date(start_time) > new Date(end_time)) {
            ctx.throw(422, '结束时间 必须大于 开始时间')
        }

    }

    // 验证 课程/专栏id是否存在
    async validateGoodsId() {
        let { ctx, service } = this
        let { type, goods_id } = ctx.request.body

        // 课程/专栏是否存在
        await service[type].isExist(goods_id)
    }

    // 不能修改状态
    async isDisabledUpdate(res) {
        const s = new Date(res.start_time)
        const n = new Date()
        const e = new Date(res.end_time)
            // 进行中/已结束/已下架不能修改
        if (((s < n) && (n < e)) || (n > e) || (res.status == 0)) {
            this.ctx.throw(400, '当前状态不能修改')
        }
    }
}

module.exports = BaseController;