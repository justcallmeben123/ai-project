'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 首页接口
    router.get('/pc/index', controller.pc.home.index);
    router.get('/pc/coupon/list', controller.pc.coupon.index);
    router.get('/pc/group/list', controller.pc.group.index);
    router.get('/pc/flashsale/list', controller.pc.flashsale.index);
    // 搜索模块
    router.get('/pc/search', controller.pc.home.search);
    // 课程模块
    router.get('/pc/course/read', controller.pc.course.read);
    router.get('/pc/course/list', controller.pc.course.index);
    // 专栏模块
    router.get('/pc/column/read', controller.pc.column.read);
    router.get('/pc/column/list', controller.pc.column.index);

    // 用户模块
    router.get('/pc/getinfo', controller.pc.user.getinfo);
    router.post('/pc/login', controller.pc.user.login);
    router.post('/pc/reg', controller.pc.user.reg);
    router.post('/pc/logout', controller.pc.user.logout);
    router.post('/pc/weixin_login', controller.pc.user.weixinLogin);
    router.post('/pc/get_captcha', controller.pc.user.getCaptcha);
    router.post('/pc/bind_mobile', controller.pc.user.bindMobile);
    router.post('/pc/forget', controller.pc.user.forget);
    router.post('/pc/update_info', controller.pc.user.updateInfo);
    router.post('/pc/update_password', controller.pc.user.updatePassword);

    // 订单模块
    router.get('/pc/order/list', controller.pc.order.index);
    router.get('/pc/goods/read', controller.pc.goods.read);
    router.post('/pc/order/save', controller.pc.order.save);
    router.post('/pc/order/flashsale', controller.pc.order.saveFlashsale);
    router.post('/pc/order/group', controller.pc.order.saveGroup);
    router.post('/pc/order/learn', controller.pc.order.learn);
    router.post('/pc/order/wxpay', controller.pc.order.wxpay);
    router.post('/pc/order/iswxpay', controller.pc.order.iswxpay);
    router.post('/order/notify', app.middleware.tenpay('pay', app), controller.pc.order.notify);

    // 公共模块
    router.post('/pc/upload', controller.pc.common.upload);
    router.get('/pc/get_template_data', controller.pc.common.getTemplateData);

    // 收藏模块
    router.get('/pc/user_fava', controller.pc.userFava.index);
    router.post('/pc/collect', controller.pc.userFava.save);
    router.post('/pc/uncollect', controller.pc.userFava.delete);

    // 优惠券模块
    router.get('/pc/user_coupon', controller.pc.userCoupon.index);
    router.post('/pc/user_coupon/receive', controller.pc.userCoupon.save);
    // 获取当前用户指定内容的可用优惠券数
    router.get('/pc/user_coupon/count', controller.pc.userCoupon.count);

    // 社区模块
    router.get('/pc/bbs', controller.pc.bbs.index);
    router.get('/pc/mypost', controller.pc.post.myPostList);
    router.get('/pc/post/read', controller.pc.post.read);
    router.get('/pc/post/list', controller.pc.post.index);
    router.get('/pc/post_comment', controller.pc.postComment.index);
    router.post('/pc/post/support', controller.pc.postSupport.save);
    router.post('/pc/post/unsupport', controller.pc.postSupport.delete);
    router.post('/pc/post/reply', controller.pc.postComment.save);
    router.post('/pc/post/delete', controller.pc.post.delete);
    router.post('/pc/post/save', controller.pc.post.save);

    // 电子书模块
    router.get('/pc/book/list', controller.pc.book.index);
    router.get('/pc/book/read', controller.pc.book.read);
    router.get('/pc/book/detail', controller.pc.book.detail);
    router.get('/pc/book/menus', controller.pc.book.menus);
    router.get('/pc/mybook', controller.pc.book.myBook);

    // 考试模块
    router.get('/pc/testpaper/list', controller.pc.testpaper.index);
    router.get('/pc/testpaper/read', controller.pc.testpaper.read);
    router.get('/pc/user_test/list', controller.pc.userTest.index);
    router.post('/pc/user_test/save', controller.pc.userTest.save);

    // 学习记录模块
    router.get('/pc/user_history/list', controller.pc.userHistory.index);
    router.post('/pc/user_history/update', controller.pc.userHistory.update);

    // 当前拼团的可组团列表
    router.get('/pc/group_work/list', controller.pc.groupWork.index);

    // 公告列表
    router.get('/pc/notice/list', controller.pc.notice.index);

    // 推荐列表
    router.get('/pc/hot', controller.pc.common.hot);

    // 直播模块
    router.get('/pc/live/read', controller.pc.live.read);
    router.get('/pc/live/list', controller.pc.live.index);
};