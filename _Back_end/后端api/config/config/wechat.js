module.exports = config => {
    config.webUrl = 'http://demonuxtapi.dishait.cn'

    // 微信app支付配置
    config.tenpay = {
        client: {
            appid: 'wxc559asde7d0a3bde',
            mchid: '1321508981',
            partnerKey: '8b07811e46a8749f1c97793464c7049f',
            notify_url: config.webUrl + '/mborder/notify',
            // pfx: require('fs').readFileSync(require('path').join(__dirname, '.', 'wechat/apiclient_key.pem')),
            // sandbox: true
        }
    }

    // 微信小程序登录和支付
    config.mpWeixin = {
        appid: 'wxb1f310de99c0fe32',
        secret: 'e3ac108f68f11fb9aa57cbb8417c8f71',
    }

    // 微信H5登录和支付
    config.H5Weixin = {
        appid: 'wxf0d23abcc66aab61',
        secret: '5e2dafs68b1260aa9354aa68146d7e77'
    }
}