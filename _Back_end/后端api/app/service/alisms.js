'use strict';

const Controller = require('egg').Controller;
const Core = require('@alicloud/pop-core');
class AlismsController extends Controller {
    // 发送验证码
    async send(phone) {
        let code = await this.createCode(phone)

        // 开启发送验证码
        if (this.app.config.aliSMS.isopen) {
            return await this.sendSMS(phone, code)
        }

        return code
    }

    // 检验验证码
    async verifyCode(phone, code) {
        const { ctx, service } = this
        let randomCode = await service.cache.get(`sendCode_${phone}`)
        if (!randomCode) {
            ctx.throw(400, '验证码已过期，请重新获取')
        }
        if (randomCode != code) {
            ctx.throw(400, '验证码错误')
        }
        // 清除redis中的验证码
        await service.cache.remove(`sendCode_${phone}`)
        return true
    }

    // 生成6位验证码
    async createCode(phone) {
        const { service } = this

        // 禁止重复获取
        if (await service.cache.get(`sendCode_${phone}`)) {
            this.ctx.throw(400, '操作太快，稍后重试')
        }

        let randomCode = Math.floor(Math.random() * 1000000)
        await service.cache.set(`sendCode_${phone}`, randomCode, this.app.config.aliSMS.expire);
        return randomCode
    }

    /**
     * 发送短信
     * @param { String } phone 用户手机号 
     * @param { String } code 生成的随机验证码
     */
    async sendSMS(phone, code) {

        const client = await this._client();
        const params = await this._params(phone, code);
        const requestOption = await this._requestOption();

        try {
            const ret = await this._send(client, params, requestOption);
            // {"Message":"OK","RequestId":"80A35575-6DD3-4A7D-B4AD-723F918CBBA5","BizId":"627317463804615179^0","Code":"OK"}
            return JSON.parse(ret)
        } catch (err) {
            this.ctx.throw(400, err.message || '发送失败')
        }
    }

    async _client() {
        return new Core({
            accessKeyId: this.app.config.aliSMS.accessKeyId,
            accessKeySecret: this.app.config.aliSMS.accessSecret,
            endpoint: this.app.config.aliSMS.endpoint,
            apiVersion: this.app.config.aliSMS.version,
        });
    }

    async _params(phone, code) {
        return {
            "RegionId": this.app.config.aliSMS.regionId,
            "PhoneNumbers": `${phone}`,
            "SignName": this.app.config.aliSMS.SignName,
            "TemplateCode": this.app.config.aliSMS.TemplateCode,
            "TemplateParam": `{\"code\":${code}}`
        }
    }
    async _requestOption() {
        return {
            method: 'POST'
        }
    }


    async _send(client, params, requestOption) {
        return new Promise((resolve, reject) => {
            client.request('SendSms', params, requestOption).then((result) => {
                resolve(JSON.stringify(result))
            }, (ex) => {
                reject(ex)
            })
        })
    }
}

module.exports = AlismsController;