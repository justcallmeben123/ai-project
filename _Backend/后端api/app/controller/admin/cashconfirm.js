'use strict';

const Controller = require('./base');

class CashconfirmController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Cashconfirm
    }

    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }
        let { status } = ctx.query
            // 状态
        if (status != undefined) {
            where.status = status
        }

        return {
            validate: {},
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.Cash,
                    attributes: ['account', 'name'],
                }],
                attributes: ['id', 'price', 'status', 'created_time'],
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
                return {
                    id: item.id,
                    price: item.price,
                    status: item.status,
                    name: item.cash.name,
                    account: item.cash.account.replace(/^(\d{4})\d+(\d{4})$/, "$1 **** **** $2"),
                    created_time: item.created_time,
                }
            })
        }
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            cash_id: {
                type: 'int',
                required: true,
                desc: '收款账户ID'
            },
            price: {
                type: 'float',
                required: true,
                desc: '提现金额'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { ctx, app, service } = this
        let { school_id } = ctx.header
        let { cash_id, price } = ctx.request.body
            // 收款账户是否存在
        await service.cash.isExist(cash_id)
            // 可提现金额查询
        if (ctx.currentSchool.status == 0) {
            ctx.throw(400, '当前网校已被禁用')
        }
        if (ctx.currentSchool.balance < price) {
            ctx.throw(400, '账户可提现金额不足')
        }

        return {
            ...data,
            school_id
        }
    }

    // 增
    async save() {
        let { ctx, app } = this;
        let currentUser = ctx.authUser;
        // 参数验证
        await this.formValidate()
            // 新增前数据处理
        let data = await this.beforeSave(this.ctx.request.body)

        // 开启事务
        let transaction;
        let res = {}
        try {
            // 建立事务对象
            transaction = await ctx.model.transaction();

            // 事务改操作
            if (!(await app.model.School.update({
                    balance: (ctx.currentSchool.balance - data.price)
                }, {
                    where: {
                        id: ctx.currentSchool.id
                    },
                    transaction,
                }))) {
                ctx.throw(400, '申请提现失败')
            }

            // 事务增操作
            res = await this.model.create(data, {
                transaction,
            })

            if (!res) {
                ctx.throw(400, '申请提现失败')
            }

            // 提交事务
            await transaction.commit();
        } catch (err) {
            // 事务回滚
            await transaction.rollback();

            return ctx.apiFail(err.message)
        }

        res = JSON.parse(JSON.stringify(res))
            // 新增后数据处理
        ctx.apiSuccess(res);
    }

}

module.exports = CashconfirmController;