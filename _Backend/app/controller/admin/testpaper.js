'use strict';

const Controller = require('./base');

class TestpaperController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.Testpaper
    }
    async getListOptions() {
        let { ctx, app, service } = this;

        let where = {
            school_id: ctx.header.school_id,
        }
        let { title, type } = ctx.query
            // 关键词
        if (title != undefined) {
            const Op = app.Sequelize.Op
            where.title = {
                [Op.like]: `%${title}%`
            }
        }

        return {
            validate: {},
            limit: 10,
            options: {
                where,
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
        opt.attributes = {
            exclude: ['created_time', 'updated_time', 'school_id']
        }
        opt.include = [{
            model: this.app.model.TestpaperQuestion,
            attributes: ['score'],
            include: [{
                model: this.app.model.Question,
                attributes: ['id', 'title', 'remark', 'type', 'value'],
            }]
        }]

        opt.where.school_id = this.ctx.header.school_id
        return opt
    }

    // 查询单个返回数据处理
    async afterRead(data) {
        data.questions = data.testpaper_questions.map(q => {
            q.question.value = q.question.value ? JSON.parse(q.question.value) : {}
            return q
        })
        delete data.testpaper_questions
        return data
    }

    // 表单验证规则
    get rules() {
        let { ctx } = this
        return {
            title: {
                type: 'string',
                required: true,
                desc: '试卷标题'
            },
            total_score: {
                type: 'int',
                required: true,
                desc: '总分'
            },
            pass_score: {
                type: 'int',
                required: true,
                desc: '及格分'
            },
            expire: {
                type: 'int',
                required: true,
                desc: '考试时长，分钟'
            },
            status: {
                type: 'int',
                required: true,
                range: { in: [0, 1]
                },
                desc: '状态'
            },
            questions: {
                type: 'array',
                required: true,
                desc: '关联题目'
            },
        }
    }

    // 新增之前
    async beforeSave(data) {
        let { ctx, app } = this
        let { school_id } = ctx.header

        return {
            ...data,
            school_id
        }
    }

    // 过滤有效题目
    async filterQuestions(data) {
        let { ctx, app, service } = this
        let { questions } = ctx.request.body
        if (!questions.length) {
            return []
        }
        // 过滤题目
        let ids = await service.question.filterIds(questions.map(o => o.question_id))

        if (!ids.length) {
            return []
        }

        let addData = []
        questions.forEach(item => {
            if (ids.includes(item.question_id)) {
                addData.push({
                    testpaper_id: data.id,
                    question_id: item.question_id,
                    score: item.score
                })
            }
        })

        return addData
    }

    // 新增之后
    async afterSave(data) {
        let { ctx, app, service } = this
        let questions = await this.filterQuestions(data)

        if (questions.length) {
            await app.model.TestpaperQuestion.bulkCreate(questions)
        }

        return data
    }

    // 更新之前查询
    async beforeUpdate() {
        let { ctx, app, service } = this;
        let { id, value } = ctx.request.body
        let { school_id } = ctx.header

        let testpaper = await this.findOrFail(this.model, {
            id,
            school_id
        })

        if (testpaper.status == 1) {
            ctx.throw(400, '该试卷已公开考试，禁止修改')
        }

        return testpaper
    }

    // 更新之后
    async afterUpdate(data) {
        let { ctx, app, service } = this
        let questions = await this.filterQuestions(data)
            // 移除之前的
        await app.model.TestpaperQuestion.destroy({
            where: {
                testpaper_id: data.id
            }
        })
        if (questions.length) {
            await app.model.TestpaperQuestion.bulkCreate(questions)
        }
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
}

module.exports = TestpaperController;