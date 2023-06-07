'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 首页接口
    router.get('/mobile/index', controller.mobile.home.index);
    router.get('/mobile/coupon', controller.mobile.coupon.index);
    router.get('/mobile/group', controller.mobile.group.index);
    router.get('/mobile/flashsale', controller.mobile.flashsale.index);
    // 搜索模块
    router.get('/mobile/search', controller.mobile.home.search);
    // 课程模块
    router.get('/mobile/course/read', controller.mobile.course.read);
    router.get('/mobile/course/list', controller.mobile.course.index);
    // 专栏模块
    router.get('/mobile/column/read', controller.mobile.column.read);
    router.get('/mobile/column/list', controller.mobile.column.index);

    // 用户模块
    router.post('/mobile/login', controller.mobile.user.login);
    router.post('/mobile/reg', controller.mobile.user.reg);
    router.post('/mobile/logout', controller.mobile.user.logout);
    // 微信登录
    router.post('/mobile/weixin_login', controller.mobile.user.weixinLogin);
    router.post('/mobile/get_captcha', controller.mobile.user.getCaptcha);
    router.post('/mobile/bind_mobile', controller.mobile.user.bindMobile);
    router.post('/mobile/forget', controller.mobile.user.forget);
    router.post('/mobile/update_info', controller.mobile.user.updateInfo);
    router.post('/mobile/update_password', controller.mobile.user.updatePassword);

    // 订单模块
    router.get('/mobile/order/list', controller.mobile.order.index);
    router.get('/mobile/goods/read', controller.mobile.goods.read);
    router.post('/mobile/order/save', controller.mobile.order.save);
    router.post('/mobile/order/flashsale', controller.mobile.order.saveFlashsale);
    router.post('/mobile/order/group', controller.mobile.order.saveGroup);
    router.post('/mobile/order/learn', controller.mobile.order.learn);
    // 微信支付
    router.post('/mobile/order/wxpay', controller.mobile.order.wxpay);
    router.post('/mborder/notify', app.middleware.tenpay('pay', app), controller.mobile.order.notify);

    // 公共模块
    router.post('/mobile/upload', controller.mobile.common.upload);

    // 收藏模块
    router.get('/mobile/user_fava', controller.mobile.userFava.index);
    router.post('/mobile/collect', controller.mobile.userFava.save);
    router.post('/mobile/uncollect', controller.mobile.userFava.delete);

    // 优惠券模块
    router.get('/mobile/user_coupon', controller.mobile.userCoupon.index);
    router.post('/mobile/user_coupon/receive', controller.mobile.userCoupon.save);
    // 获取当前用户指定内容的可用优惠券数
    router.get('/mobile/user_coupon/count', controller.mobile.userCoupon.count);

    // 社区模块
    router.get('/mobile/bbs', controller.mobile.bbs.index);
    router.get('/mobile/mypost', controller.mobile.post.myPostList);
    router.get('/mobile/post/read', controller.mobile.post.read);
    router.get('/mobile/post/list', controller.mobile.post.index);
    router.get('/mobile/post_comment', controller.mobile.postComment.index);
    router.post('/mobile/post/support', controller.mobile.postSupport.save);
    router.post('/mobile/post/unsupport', controller.mobile.postSupport.delete);
    router.post('/mobile/post/reply', controller.mobile.postComment.save);
    router.post('/mobile/post/delete', controller.mobile.post.delete);
    router.post('/mobile/post/save', controller.mobile.post.save);

    // 电子书模块
    router.get('/mobile/book/list', controller.mobile.book.index);
    router.get('/mobile/book/read', controller.mobile.book.read);
    router.get('/mobile/book/detail', controller.mobile.book.detail);
    router.get('/mobile/mybook', controller.mobile.book.myBook);

    // 考试模块
    router.get('/mobile/testpaper/list', controller.mobile.testpaper.index);
    router.get('/mobile/testpaper/read', controller.mobile.testpaper.read);
    router.get('/mobile/user_test/list', controller.mobile.userTest.index);
    router.post('/mobile/user_test/save', controller.mobile.userTest.save);

    // 学习记录模块
    router.get('/mobile/user_history/list', controller.mobile.userHistory.index);
    router.post('/mobile/user_history/update', controller.mobile.userHistory.update);

    // 当前拼团的可组团列表
    router.get('/mobile/group_work/list', controller.mobile.groupWork.index);

    // 公告列表
    router.get('/mobile/notice/list', controller.mobile.notice.index);

    // 直播模块
    router.get('/mobile/live/read', controller.mobile.live.read);
    router.get('/mobile/live/list', controller.mobile.live.index);
    router.get('/mobile/live_comment', controller.mobile.liveComment.index);
    router.post('/mobile/live_comment/save', controller.mobile.liveComment.save);
};