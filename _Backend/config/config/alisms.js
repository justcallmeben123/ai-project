module.exports = config => {
    config.aliSMS = {
        isopen: false, // 是否开启短信发送
        expire: 60, // 短信验证码有效期
        accessKeyId: 'LTAI5tLbaKqqsqByS2E3hmCR',
        accessSecret: 'wOnijFCytd8XeEHzPi0Arj8io6DmZN',
        regionId: 'cn-hangzhou',
        endpoint: "https://dysmsapi.aliyuncs.com",
        // product: '',
        version: '2017-05-25',
        SignName: '<!--你的签名-->',
        TemplateCode: 'SMS_163271467'
    }
}