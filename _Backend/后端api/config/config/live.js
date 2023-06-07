module.exports = config => {
    // 流媒体配置
    config.mediaServerBaseUrl = "demonuxtapi.dishait.cn"
    config.mediaServer = {
        rtmp: {
            port: 23484,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
        http: {
            port: 23485,
            allow_origin: '*'
        },
        // https: {
        //   port: 8443,
        //   key:'./privatekey.pem',
        //   cert:'./certificate.pem',
        // },
        auth: {
            play: true,
            publish: true,
            secret: 'nodemedia2017privatekey',
            // api: true,
            // api_user: 'admin',
            // api_pass: 'admin',
        }
    };
}