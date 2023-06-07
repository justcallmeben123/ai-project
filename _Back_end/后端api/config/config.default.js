/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1613810291290_3426';


    config.security = {
        // 关闭 csrf
        csrf: {
            enable: false,
        },
        // 跨域白名单
        // domainWhiteList: ['http://localhost:3000'],
    };
    // 允许跨域的方法
    config.cors = {
        origin: '*',
        allowMethods: 'GET, PUT, POST, DELETE, PATCH'
    };

    config.crypto = {
        secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672'
    };

    require('./config/middleware')(config)
    require('./config/mysql')(config)
    require('./config/file')(config)
    require('./config/queue')(config)
    require('./config/alisms')(config)
    require('./config/valparams')(config)
    require('./config/redis')(config)
    require('./config/jwt')(config)
    require('./config/wechat')(config)
    require('./config/live')(config)

    return {
        ...config,
    };
};