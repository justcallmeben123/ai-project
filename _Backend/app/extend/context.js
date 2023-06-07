module.exports = {
    // 演示数据禁止操作
    testThrow(id, ids = []){
        if(ids.includes(id)){
            this.ctx.throw(400, '演示数据，禁止操作')
        }
    },
    // 成功提示
    apiSuccess(data = '', msg = 'ok', code = 20000) {
        this.body = { msg, data, code };
        this.status = 200;
    },
    // 失败提示
    apiFail(data = '', msg = 'fail', code = 400) {
        this.body = { msg, data };
        this.status = code;
    },
    // 生成唯一id
    genID() {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    // 是否是邮箱
    isEmail(val) {
        return (new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)).test(val)
    },
    // 是否是手机号码
    isPhone(val) {
        return (new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)).test(val)
    },
    // 字符串首字母转大写
    firstToUpper(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    },
    // 创建订单号
    createOrderNo() {
        const now = new Date()
        const year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let hour = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        String(month).length < 2 ? (month = Number("0" + month)) : month;
        String(day).length < 2 ? (day = Number("0" + day)) : day;
        String(hour).length < 2 ? (hour = Number("0" + hour)) : hour;
        String(minutes).length < 2 ? (minutes = Number("0" + minutes)) : minutes;
        String(seconds).length < 2 ? (seconds = Number("0" + seconds)) : seconds;
        const yyyyMMddHHmmss = `${year}${month}${day}${hour}${minutes}${seconds}`;
        return yyyyMMddHHmmss + Math.random().toString(36).substr(2, 9);
    },
    // 获取H5微信登录openID
    async getH5OpenId(code) {
        if (!code) {
            this.throw(422, 'code不能为空')
        }
        const { appid, secret } = this.app.config.H5Weixin
        const result = await this.curl(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`, {
            method: 'POST',
            dataType: 'json',
        });
        if (result.data.errmsg) {
            this.throw(400, result.data.errmsg)
        }
        return result.data
    },
    // 根据access_token和openId获取H5用户相关信息
    async getH5WechatUserInfoByOpenId(access_token, openid) {
        const result = await this.curl(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`, {
            method: 'GET',
            dataType: 'json',
        });

        if (result.data.errmsg) {
            this.throw(400, result.data.errmsg)
        }

        return result.data
    },
    // 获取微信小程序登录openID
    async getMpOpenId(code, type = 'mp') {
        if (!code) {
            this.throw(422, 'code不能为空')
        }
        const { appid, secret } = this.app.config[type + 'Weixin']
        const result = await this.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`, {
            method: 'POST',
            dataType: 'json',
        });
        if (result.data.errmsg) {
            this.throw(400, result.data.errmsg)
        }
        return result.data
    },
    // 获取微信小程序的access_token
    async getAccessToken() {
        const { appid, secret } = this.app.config.mpWeixin
        const result = await this.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`, {
            method: 'GET',
            dataType: 'json',
        });
        if (result.data.errmsg) {
            this.throw(400, result.data.errmsg)
        }
        return result.data.access_token
    },
    // 根据access_token和openId获取用户相关信息
    async getWechatUserInfoByOpenId(access_token, openid) {
        const result = await this.curl(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`, {
            method: 'GET',
            dataType: 'json',
        });

        if (result.data.errmsg) {
            this.throw(400, result.data.errmsg)
        }

        return result.data
    }
}