'use strict';

const Controller = require('egg').Controller;
// 引入
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const querystring = require('querystring');
const crypto = require('crypto');
class CommonController extends Controller {
    // 视频点播上传签名
    async sign() {
        // 确定 app 的云 API 密钥
        var { secret_id, secret_key, vodSubAppId } = this.app.config.tencentVod;

        // 确定签名的当前时间和失效时间
        var current = parseInt((new Date()).getTime() / 1000)
        var expired = current + 86400; // 签名有效期：1天

        // 向参数列表填入参数
        var arg_list = {
            secretId: secret_id,
            currentTimeStamp: current,
            expireTime: expired,
            random: Math.round(Math.random() * Math.pow(2, 32)),
            oneTimeValid: 1,
            vodSubAppId,
        }

        // 计算签名
        var orignal = querystring.stringify(arg_list);
        var orignal_buffer = new Buffer(orignal, "utf8");

        var hmac = crypto.createHmac("sha1", secret_key);
        var hmac_buffer = hmac.update(orignal_buffer).digest();

        var signature = Buffer.concat([hmac_buffer, orignal_buffer]).toString("base64");

        this.ctx.apiSuccess(signature);
    }
    // 上传
    async upload() {
        const { ctx, app } = this;
        const currentUser = ctx.authUser;

        if (!ctx.request.files) {
            return ctx.apiFail('请先选择上传文件');
        }

        const file = ctx.request.files[0];
        const name = 'egg-edu-demo/' + ctx.genID() + path.extname(file.filename);

        let result;
        try {
            result = await ctx.oss.put(name, file.filepath);
        } catch (err) {
            ctx.throw(400, err.name);
        }

        if (result) {
            return ctx.apiSuccess(result.url);
        }

        ctx.apiFail('上传失败');
    }

    async importExcel() {
        const { ctx, app } = this;
        if (!ctx.request.files) {
            return ctx.apiFail('请先选择上传文件');
        }

        const file = ctx.request.files[0];
        // 存储获取到的数据
        let exceldata = [];
        // 读取内容
        const workbook = XLSX.readFile(file.filepath);
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        const sheetToType = {
            "单选题": "radio",
            "多选题": "checkbox",
            "判断题": "trueOrfalse",
            "问答题": "answer",
            "填空题": "completion"
        }
        for (const sheet in workbook.Sheets) {
            let type = sheetToType[sheet]
            if (type && workbook.Sheets.hasOwnProperty(sheet)) {
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                let d = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                d = d.filter(o => o['题目'])
                d = d.map(o => {
                    let value = {
                        options: []
                    }
                    if (type == 'radio' || type == 'checkbox' || type == 'completion') {
                        value.value = type == 'checkbox' ? [] : ''
                        for (const key in o) {
                            if (key.search("选项") != -1) {
                                let u = (key.split("选项"))[1]
                                value.options.push(o[key])
                                let i = value.options.length - 1
                                if (type == 'radio' && (o["答案"].search(u) != -1)) {
                                    value.value = i
                                } else if (type == 'checkbox' && (o["答案"].search(u) != -1)) {
                                    value.value.push(i)
                                }
                            }
                            if (key.search("填空") != -1) {
                                value.options.push(o[key])
                            }
                        }
                    }

                    if (type == 'trueOrfalse') {
                        value.options = ['正确', '错误']
                        value.value = o["答案"] == '正确' ? 0 : 1
                    }

                    if (type == 'answer') {
                        value.options = [o["答案"]]
                    }

                    return {
                        title: o['题目'],
                        remark: o['解析'],
                        type,
                        value: JSON.stringify(value),
                        school_id: ctx.header.school_id
                    }
                })
                exceldata = [...exceldata, ...d]
            }
        }
        // 批量写入
        if (exceldata.length == 0) {
            ctx.throw(400, '文件数据格式有误或无数据')
        }
        ctx.apiSuccess(await app.model.Question.bulkCreate(exceldata))
    }
    
    // 统计数据
    async statistics() {
        const { ctx, app } = this
        const Op = app.Sequelize.Op
        let res1 = await app.model.Order.count({
            where: {
                [Op.and]: [
                    app.Sequelize.where(app.Sequelize.fn('TO_DAYS', app.Sequelize.col('created_time')), app.Sequelize.fn('TO_DAYS', app.Sequelize.fn('now')))
                ],
                status: "success"
            },
            group: ['user_id']
        })

        let today_income = await app.model.Order.sum('price', {
            where: {
                [Op.and]: [
                    app.Sequelize.where(app.Sequelize.fn('TO_DAYS', app.Sequelize.col('created_time')), app.Sequelize.fn('TO_DAYS', app.Sequelize.fn('now')))
                ],
                status: "success"
            },
        })

        let res2 = await app.model.Order.count({
            where: {
                status: "success"
            },
            group: ['user_id']
        })

        ctx.apiSuccess({
            today_income,
            today_pay_user: res1.length,
            total_pay_user: res2.length,
            balance: parseInt(ctx.currentSchool.balance)
        })
    }
}

module.exports = CommonController;