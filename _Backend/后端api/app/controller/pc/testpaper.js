'use strict';

const Controller = require('../base');

class TestpaperController extends Controller {
    // 考试列表
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        let where = {
            school_id,
            status: 1
        }

        let include = []
        if (ctx.authUser) {
            include.push({
                model: app.model.UserTest,
                where: {
                    school_id,
                    user_id: ctx.authUser.id
                },
                required: false,
                attributes: ['id'],
            })
        }

        let res = await this.list(app.model.Testpaper, {
            where,
            include,
            attributes: ["id", "title", "total_score", "pass_score", "expire", [app.Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM testpaper_question AS testpaper_question
                    WHERE
                    testpaper_question.testpaper_id = testpaper.id
                )`),
                'question_count'
            ]],
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(o => {
                if (o.user_tests) {
                    o.is_test = !!o.user_tests.length
                    delete o.user_tests
                }
                return o
            })
        })
    }

    // 开始考试
    async read() {
        let { ctx, app, service } = this

        let { id } = ctx.query

        let school_id = ctx.currentSchool.id
        let user_id = ctx.authUser.id
        let where = {
            id,
            school_id,
            status: 1
        }

        if ((await app.model.UserTest.findOne({
                where: {
                    testpaper_id: id,
                    school_id,
                    user_id
                },
                attributes: ['id'],
            }))) {
            ctx.throw(400, '你已经考过了')
        }


        let res = await this.findOne(app.model.Testpaper, {
            where,
            attributes: ["id", "title", "total_score", "pass_score", "expire"],
            include: [{
                model: app.model.TestpaperQuestion,
                attributes: ["id", "score"],
                include: [{
                    model: app.model.Question,
                    attributes: ["id", "title", "remark", "type", "value"],
                }]
            }],

        })

        if (res.testpaper_questions.length == 0) {
            ctx.throw(400, '该试卷还没有题目')
        }

        // 初始答案
        let values = []
        res.testpaper_questions = res.testpaper_questions.map(o => {
            let options = [""]
            let user_value = []

            if (o.question.type == 'radio' || o.question.type == 'trueOrfalse') {
                user_value = -1
            } else if (o.question.type == 'checkbox') {
                user_value = []
            } else {
                user_value = [""]
            }
            if (["radio", "checkbox", "trueOrfalse"].includes(o.question.type)) {
                let v = o.question.value ? JSON.parse(o.question.value) : {
                    options: [""]
                }
                options = v.options
            }
            let r = {
                id: o.id,
                score: o.score,
                question_id: o.question.id,
                title: o.question.title,
                remark: o.question.remark,
                type: o.question.type,
                options,
                user_value
            }

            values.push({
                type: o.question.type,
                answer: user_value,
                score: 0
            })

            if (o.question.type == 'completion' || o.question.type == 'answer') {
                delete r.options
            }

            return r
        })

        // 创建考试
        let ut = await app.model.UserTest.create({
            testpaper_id: id,
            school_id,
            user_id,
            answer_status: 0,
            read_status: 0,
            values: JSON.stringify(values)
        })
        if (!ut) {
            ctx.throw(400, '创建考试失败')
        }

        res.user_test_id = ut.id

        // 开启自动交卷任务
        await service.queue.addAutoCloseTestTask(ut.id, res.expire * 60)

        ctx.apiSuccess(res)
    }

}

module.exports = TestpaperController;