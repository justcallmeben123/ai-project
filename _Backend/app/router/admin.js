'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;

    router.get('/test', controller.test.echo);
    // 用户模块
    // 用户注册
    router.post('/user/reg', controller.admin.user.reg);
    router.post('/user/login', controller.admin.user.login);
    router.get('/admin/user/info', controller.admin.user.info);
    router.post('/admin/user/logout', controller.admin.user.logout);

    // 网校相关
    router.get('/admin/school', controller.admin.school.list);
    router.post('/admin/school/save', controller.admin.school.save);
    router.post('/admin/school/update', controller.admin.school.update);
    router.post('/admin/s/school/update', controller.admin.school.update);
    // router.post('/admin/school/delete', controller.admin.school.delete);
    router.get('/admin/s/school/read', controller.admin.school.read);

    // 角色相关
    router.get('/admin/role', controller.admin.role.list);
    router.get('/admin/role/read', controller.admin.role.read);

    // 菜单权限相关
    router.get('/admin/access', controller.admin.access.list);

    // 员工相关
    router.get('/admin/s/schoolstaff', controller.admin.schoolstaff.list);
    router.post('/admin/s/schoolstaff/save', controller.admin.schoolstaff.save);
    router.post('/admin/s/schoolstaff/setroles', controller.admin.schoolstaff.setRoles);
    router.get('/admin/s/schoolstaff/accesses', controller.admin.schoolstaff.getAccesses);
    router.post('/admin/s/schoolstaff/delete', controller.admin.schoolstaff.delete);

    // 课程相关
    router.get('/admin/s/course', controller.admin.course.list);
    router.post('/admin/s/course/save', controller.admin.course.save);
    router.post('/admin/s/course/update', controller.admin.course.update);
    router.post('/admin/s/course/delete', controller.admin.course.delete);
    router.post('/admin/s/course/updatestatus', controller.admin.course.updateStatus);

    // 专栏相关
    router.get('/admin/s/column', controller.admin.column.list);
    router.get('/admin/s/column/read', controller.admin.column.read);
    router.post('/admin/s/column/save', controller.admin.column.save);
    router.post('/admin/s/column/update', controller.admin.column.update);
    router.post('/admin/s/column/delete', controller.admin.column.delete);
    router.post('/admin/s/column/updatestatus', controller.admin.column.updateStatus);
    router.post('/admin/s/column/updateend', controller.admin.column.updateend);
    // 专栏目录相关
    router.get('/admin/s/column_course', controller.admin.columnCourse.list);
    router.post('/admin/s/column_course/save', controller.admin.columnCourse.save);
    router.post('/admin/s/column_course/sort', controller.admin.columnCourse.sort);
    router.post('/admin/s/column_course/delete', controller.admin.columnCourse.delete);

    // 网校用户相关
    router.get('/admin/s/school_user', controller.admin.schoolUser.list);
    router.get('/admin/s/school_user/read', controller.admin.schoolUser.read);
    router.post('/admin/s/school_user/updateaccess', controller.admin.schoolUser.updateAccessStatus);
    router.post('/admin/s/school_user/updatecomment', controller.admin.schoolUser.updateCommentStatus);

    // 网校用户订阅相关
    router.get('/admin/s/order_item', controller.admin.orderItem.list);

    // 网校用户订单相关
    router.get('/admin/s/order', controller.admin.order.list);
    router.post('/admin/s/order/delete', controller.admin.order.delete);


    // 网校用户观看历史相关
    router.get('/admin/s/user_history', controller.admin.userHistory.list);

    // 收款账户相关
    router.get('/admin/s/cash', controller.admin.cash.list);
    router.post('/admin/s/cash/save', controller.admin.cash.save);
    router.post('/admin/s/cash/update', controller.admin.cash.update);
    router.post('/admin/s/cash/delete', controller.admin.cash.delete);

    // 申请提现相关
    router.get('/admin/s/cashconfirm', controller.admin.cashconfirm.list);
    router.post('/admin/s/cashconfirm/save', controller.admin.cashconfirm.save);

    // 拼团相关
    router.get('/admin/s/group', controller.admin.group.list);
    router.post('/admin/s/group/save', controller.admin.group.save);
    router.post('/admin/s/group/update', controller.admin.group.update);
    router.post('/admin/s/group/updatestatus', controller.admin.group.updateStatus);

    // 秒杀相关
    router.get('/admin/s/flashsale', controller.admin.flashsale.list);
    router.post('/admin/s/flashsale/save', controller.admin.flashsale.save);
    router.post('/admin/s/flashsale/update', controller.admin.flashsale.update);
    router.post('/admin/s/flashsale/updatestatus', controller.admin.flashsale.updateStatus);

    // 优惠券相关
    router.get('/admin/s/coupon', controller.admin.coupon.list);
    router.post('/admin/s/coupon/save', controller.admin.coupon.save);
    router.post('/admin/s/coupon/update', controller.admin.coupon.update);
    router.post('/admin/s/coupon/updatestatus', controller.admin.coupon.updateStatus);

    // 社区相关
    router.get('/admin/s/bbs', controller.admin.bbs.list);
    router.post('/admin/s/bbs/save', controller.admin.bbs.save);
    router.post('/admin/s/bbs/update', controller.admin.bbs.update);
    router.post('/admin/s/bbs/updatestatus', controller.admin.bbs.updateStatus);
    router.post('/admin/s/bbs/delete', controller.admin.bbs.delete);
    router.post('/admin/s/bbs/setmanagers', controller.admin.bbs.setManagers);

    // 帖子相关
    router.get('/admin/s/post', controller.admin.post.list);
    router.post('/admin/s/post/updateistop', controller.admin.post.updateIsTop);
    router.post('/admin/s/post/delete', controller.admin.post.delete);

    // 帖子评论相关
    router.get('/admin/s/post_comment', controller.admin.postComment.list);
    router.post('/admin/s/post_comment/delete', controller.admin.postComment.delete);

    // 题库相关
    router.get('/admin/s/question', controller.admin.question.list);
    router.post('/admin/s/question/save', controller.admin.question.save);
    router.post('/admin/s/question/update', controller.admin.question.update);
    router.post('/admin/s/question/delete', controller.admin.question.delete);

    // 考试相关
    router.get('/admin/s/testpaper', controller.admin.testpaper.list);
    router.get('/admin/s/testpaper/read', controller.admin.testpaper.read);
    router.post('/admin/s/testpaper/save', controller.admin.testpaper.save);
    router.post('/admin/s/testpaper/update', controller.admin.testpaper.update);
    router.post('/admin/s/testpaper/delete', controller.admin.testpaper.delete);
    router.get('/admin/s/user_test', controller.admin.userTest.list);
    router.post('/admin/s/user_test/delete', controller.admin.userTest.delete);
    router.post('/admin/s/user_test/update_readstatus', controller.admin.userTest.updateReadStatus);
    router.get('/admin/s/user_test/read', controller.admin.userTest.read);

    // 电子书相关
    router.get('/admin/s/book', controller.admin.book.list);
    router.get('/admin/s/book/read', controller.admin.book.read);
    router.post('/admin/s/book/save', controller.admin.book.save);
    router.post('/admin/s/book/update', controller.admin.book.update);
    // router.post('/admin/s/book/delete', controller.admin.book.delete);
    router.post('/admin/s/book/updatestatus', controller.admin.book.updateStatus);
    // 电子书章节相关
    router.get('/admin/s/book_detail', controller.admin.bookDetail.list);
    router.post('/admin/s/book_detail/save', controller.admin.bookDetail.save);
    router.post('/admin/s/book_detail/update', controller.admin.bookDetail.update);
    router.post('/admin/s/book_detail/sort', controller.admin.bookDetail.sort);
    router.post('/admin/s/book_detail/delete', controller.admin.bookDetail.delete);

    // 可视化相关
    router.get('/admin/s/renovation', controller.admin.renovation.list);
    router.get('/admin/s/renovation/read', controller.admin.renovation.read);
    router.post('/admin/s/renovation/save', controller.admin.renovation.save);
    router.post('/admin/s/renovation/update', controller.admin.renovation.update);
    router.post('/admin/s/renovation/delete', controller.admin.renovation.delete);

    // 上传文件
    router.post('/admin/s/upload', controller.admin.common.upload);
    router.post('/admin/s/importexcel', controller.admin.common.importExcel);

    router.get('/admin/s/statistics', controller.admin.common.statistics)
    
    // 视频点播vod
    router.get('/admin/sign',controller.admin.common.sign)

    // 店铺地址
    router.get('/school/:id', controller.common.school)

    // 直播相关
    router.get('/admin/s/live/read', controller.admin.live.read);
    router.get('/admin/s/live', controller.admin.live.list);
    router.post('/admin/s/live/save', controller.admin.live.save);
    router.post('/admin/s/live/update', controller.admin.live.update);
    router.post('/admin/s/live/delete', controller.admin.live.delete);
};