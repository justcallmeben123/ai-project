'use strict';

const Controller = require('../base');

class User_testController extends Controller {
    // 我的考试列表
    async index() {
        const { ctx, app } = this

        const Op = app.Sequelize.Op
        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id
        let where = {
            school_id,
            user_id
        }

        let res = await this.list(app.model.UserTest, {
            where,
            attributes: ["id", "answer_status", "read_status", "score", "created_time"],
            include: [{
                model: app.model.Testpaper,
                attributes: [
                    "id", "title", "total_score", "pass_score", "expire", [app.Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM testpaper_question AS testpaper_question
                            WHERE
                            testpaper_question.testpaper_id = testpaper.id
                        )`),
                        'question_count'
                    ]
                ],
            }],
            order: [
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(o => {
                o.created_time = app.formatTime(o.created_time)
                return o
            })
        })
    }

    // 考试交卷
    async save() {
        let { ctx, app, service } = this;

        ctx.validate({
            user_test_id: {
                type: "int",
                required: true,
                desc: "考试ID"
            },
            value: {
                type: "array",
                required: true,
                desc: "考生答案"
            },
        })

        const user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id
        let { user_test_id, value } = ctx.request.body

        // 考试ID是否存在
        let ut = await app.model.UserTest.findOne({
            where: {
                id: user_test_id,
                school_id,
                user_id,
                answer_status: 0
            },
            attributes: ['id', 'values', 'answer_status', 'created_time'],
            include: [{
                model: app.model.Testpaper,
                attributes: ["expire"],
                include: [{
                    model: app.model.TestpaperQuestion,
                    attributes: ["id"],
                    include: [{
                        model: app.model.Question,
                        attributes: ["type", "value"],
                    }]
                }],
            }]
        })
        if (!ut) {
            ctx.throw(400, '考试ID不存在')
        }

        let testpaper = ut.testpaper
        let questions = testpaper.testpaper_questions

        // 考试超时
        if (((new Date()).getTime() - (new Date(ut.created_time)).getTime()) > (testpaper.expire * 60 * 1000)) {
            ctx.throw(400, '你考试超时了')
        }

        // value数据内容验证
        if (value.length != questions.length) {
            ctx.throw(400, '提交的考生答案题目数跟试卷的不一致')
        }
        const t = {
            radio: "单选",
            trueOrfalse: "判断",
            checkbox: "多选",
            answer: "问答",
            completion: "填空"
        }
        value = questions.map((o, i) => {
            let type = o.question.type
            if (type == 'radio' || type == 'trueOrfalse') {
                if (typeof value[i] != 'number' || value[i] < 0) {
                    ctx.throw(400, `第${i+1}题 ${t[type]}的答案必须是int类型且大于-1`)
                }
            } else {
                if (!Array.isArray(value[i]) || !value[i].length) {
                    ctx.throw(400, `第${i+1}题 ${t[type]}题的答案必须是数组类型且长度大于1`)
                }
            }
            return {
                type,
                answer: value[i],
                score: 0
            }
        })

        ut.values = JSON.stringify(value)
        ut.answer_status = 1
        await ut.save()

        // 关闭自动交卷延迟队列
        await service.queue.removeAutoCloseTestTask(ut.id)

        ctx.apiSuccess('ok')
    }
}

module.exports = User_testController;