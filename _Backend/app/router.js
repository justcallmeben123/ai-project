'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 后台api
    require('./router/admin')(app);
    // 移动端api
    require('./router/mobile')(app);
    // 平台端api
    require('./router/platform')(app);
    // PC端api
    require('./router/pc')(app);
};