'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 角色相关
    router.get('/platform/role', controller.platform.role.list);
    router.get('/platform/role/read', controller.platform.role.read);
    router.post('/platform/role/save', controller.platform.role.save);
    router.post('/platform/role/update', controller.platform.role.update);
    router.post('/platform/role/delete', controller.platform.role.delete);
    router.post('/platform/role/setrules', controller.platform.role.setRules);

    // 菜单权限相关
    router.get('/platform/access', controller.platform.access.list);

};