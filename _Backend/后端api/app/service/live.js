'use strict';

const Service = require('./base');
const md5 = require('md5');
class LiveService extends Service {
    // 生成签名
    sign(key, expire = null, appName = 'live') {
        let { ctx, app } = this;
        const secret = app.config.mediaServer.auth.secret

        if (expire) {
            expire = (new Date(expire)).getTime()
        } else {
            expire = parseInt((Date.now() + 100000000) / 1000);
        }

        const hashValue = md5(`/${appName}/${key}-${expire}-${secret}`);
        return `${expire}-${hashValue}`
    }

    // 获取推流/拉流地址
    getPushAndPlayUrl(key, expire = null, appName = 'live') {
        let { ctx, app } = this;
        let sign = this.sign(key, expire, appName)
        let { rtmp, http } = app.config.mediaServer
        let mediaServerBaseUrl = app.config.mediaServerBaseUrl
        return {
            pushUrl: `rtmp://${mediaServerBaseUrl}:${rtmp.port}/${appName}/${key}?sign=${sign}`,
            playUrl: `http://${mediaServerBaseUrl}:${http.port}/${appName}/${key}.flv?sign=${sign}`
        }
    }

    // 判断直播状态
    getStatus(data) {
        let start_time = new Date(data.start_time)
        let now = new Date()
        let end_time = new Date(data.end_time)
        let status = ''
        if (start_time > now) {
            status = "未开始"
        } else if (end_time < now) {
            status = "已结束"
        } else {
            status = "直播中"
        }
        return status
    }

    // 获取直播信息（id，封面，标题，价格，类型）
    async getGoodsInfo(id) {
        const { ctx } = this
        const school_id = ctx.currentSchool.id
        const options = {
            where: {
                id,
                school_id,
            },
            attributes: ["id", "title", "cover", "price"]
        }
        return await this.findOrFail('Live', options, '直播ID不存在')
    }
}

module.exports = LiveService;