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
}

module.exports = CommonController;