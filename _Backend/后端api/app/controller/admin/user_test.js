'use strict';

const Controller = require('./base');

class User_testController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.UserTest
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }
        let { answer_status, read_status } = ctx.query

        if (answer_status != undefined && answer_status) {
            where.answer_status = answer_status
        }

        if (read_status != undefined && read_status) {
            where.read_status = read_status
        }

        return {
            validate: {
                answer_status: {
                    required: false,
                    type: "int",
                    range: { in: [0, 1]
                    }
                },
                read_status: {
                    required: false,
                    type: "int",
                    range: { in: [0, 1]
                    }
                }
            },
            limit: 10,
            options: {
                where,
                include: [{
                    model: app.model.Testpaper,
                    attributes: ['id', 'title']
                }, {
                    model: app.model.User,
                    attributes: ['id', 'username', 'nickname']
                }],
                attributes: ['id', 'answer_status', 'read_status', 'score', 'created_time'],
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
                return item
            })
        }
    }

    // 查询单个之前
    async beforeRead(opt) {
        let { app } = this
        opt.where.school_id = this.ctx.header.school_id
        opt.include = [{
            model: app.model.Testpaper,
            attributes: ['id', 'title'],
            include: [{
                model: this.app.model.TestpaperQuestion,
                attributes: ['score'],
                include: [{
                    model: this.app.model.Question,
                    attributes: ['id', 'title', 'remark', 'type', 'value'],
                }]
            }]
        }]
        opt.attributes = ['id', 'score', 'values']
        return opt
    }

    // 查询单个返回数据处理
    async afterRead(data) {
        data.values = data.values ? JSON.parse(data.values) : []

        data.questions = data.testpaper.testpaper_questions.map(q => {
            q.question.value = q.question.value ? JSON.parse(q.question.value) : {}
            return q
        })
        delete data.testpaper.testpaper_questions
        return data
    }

    // 删除之前
    async beforeDelete(where) {
        where.school_id = this.ctx.header.school_id
        if(this.ctx.header.school_id == 11){
            this.ctx.throw(400, '演示数据，禁止删除')
        }
        return where
    }

    // 阅卷
    async updateReadStatus() {
        let { ctx, app } = this
        ctx.validate({
            id: {
                required: true,
                desc: "ID",
                type: "int"
            },
            scores: {
                required: true,
                type: "array",
                desc: "每道题的分数"
            }
        })

        let { id, scores } = ctx.request.body
        let { school_id } = ctx.header

        let test = await this.findOrFail(this.model, {
            id,
            school_id
        }, {
            attributes: ['id', 'answer_status', 'read_status', 'score', 'values'],
            include: [{
                model: app.model.Testpaper,
                attributes: ['id'],
                include: [{
                    model: this.app.model.TestpaperQuestion,
                    attributes: ['score'],
                }]
            }]
        })

        if (test.answer_status == 0) {
            ctx.throw(400, '当前考试还没答完，禁止阅卷')
        }

        if (test.read_status == 1) {
            ctx.throw(400, '当前考试已经阅卷完成')
        }

        // scores长度是否合法
        const qs = test.testpaper.testpaper_questions
        if (qs.length !== scores.length) {
            ctx.throw(422, 'scores参数格式错误')
        }

        test.values = JSON.parse(test.values)
            // 分数合法性
        qs.forEach((q, index) => {
            if (parseFloat(scores[index]) > q.score) {
                ctx.throw(422, `第${index + 1}道题 最多只能是 ${q.score}分`)
            }
            test.values[index].score = scores[index]
            test.score += scores[index]
        })

        test.values = JSON.stringify(test.values)
        test.read_status = 1
        ctx.apiSuccess(await test.save());
    }

}

module.exports = User_testController;