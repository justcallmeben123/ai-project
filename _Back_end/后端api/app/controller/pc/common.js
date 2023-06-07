'use strict';

const Controller = require('egg').Controller;

class CommonController extends Controller {
    // 上传图片
    async upload() {
        const { ctx, service } = this
        let url = await service.common.upload()
        ctx.apiSuccess(url)
    }

    // 微信小程序登录
    async mpWxLogin() {
        const { ctx, app } = this;
        const urlStr = 'https://api.weixin.qq.com/sns/jscode2session'
        const data = {
            appid: app.config.mpWeixin.appid, // 小程序 appId
            secret: app.config.mpWeixin.appSecret, // 小程序 appSecret
            js_code: ctx.query.code, // 登录时获取的 code
            grant_type: 'authorization_code' // 授权类型，此处只需填写 authorization_code
        }
        const result = await ctx.curl(urlStr, {
            data: data,
            dataType: 'json',
        });

        if (result.data.errmsg) {
            ctx.throw(400, result.data.errmsg)
        }
        ctx.apiSuccess(result.data.openid)
    }

    // 侧边推荐课程列表
    async hot() {
        const { ctx, app } = this
        let where = {
            status: 1,
        }
        
        // 演示数据，可以删除
        if(ctx.currentSchool.id == 11){
            where.id = {
                [app.Sequelize.Op.in]: [11,6,7,25]
            }
        }
        
        let res = await app.model.Course.findAll({
            where,
            attributes: ["id", "title", "cover", "price", "t_price", "type", "sub_count"],
            limit: 5,
            order: [
                ['sub_count', 'desc'],
                ['id', 'desc']
            ]
        })

        ctx.apiSuccess(res)
    }

    // 获取公共头部/底部信息
    async getTemplateData() {
        let { ctx, app } = this

        ctx.validate({
            type: {
                type: "string",
                required: true,
                desc: "类型",
                range: { in: ['header', 'footer']
                }
            },
        })

        let school_id = ctx.currentSchool.id

        let r = await app.model.Renovation.findOne({
            where: {
                school_id,
                type: "index",
                ismobile: 0
            },
            attributes: ['template']
        })

        let template = JSON.parse(r.template)

        ctx.apiSuccess(template.find(o => o.type == ctx.query.type))
    }
}

module.exports = CommonController;