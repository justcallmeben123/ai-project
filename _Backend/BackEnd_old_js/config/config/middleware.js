module.exports = config => {
    // add your middleware config here
    config.middleware = [
        'errorHandler',
        'isLogin',
        'checkSchool',
        'checkStaffAuth',
        'checkPlatformAuth',
        'checkAppid',
        'getCurrentUser',
        'getCurrentUserAuth',
        'checkBindPhone'
    ];

    // 验证平台端部分
    config.checkPlatformAuth = {
        match: ['/platform']
    }

    // 验证移动端部分
    // 验证appid
    config.checkAppid = {
        match: ['/mobile', '/pc']
    }

    // 获取当前用户信息（无需权限验证）
    config.getCurrentUser = {
        match: [
            // 移动端
            '/mobile/coupon',
            '/mobile/post/list',
            '/mobile/post/read',
            '/mobile/book/read',
            '/mobile/book/detail',
            '/mobile/course/read',
            '/mobile/column/read',
            '/mobile/live/read',
            '/mobile/testpaper/list',

            // pc端
            '/pc/coupon',
            '/pc/post/list',
            '/pc/post/read',
            '/pc/book/read',
            '/pc/book/detail',
            '/pc/course/read',
            '/pc/column/read',
            '/pc/live/read',
            '/pc/testpaper/list',
            '/pc/getinfo'
        ]
    }

    // 获取当前用户信息（权限验证）
    config.getCurrentUserAuth = {
        match: [
            // 移动端
            '/mobile/logout',
            '/mobile/bind_mobile',
            '/mobile/update_info',
            '/mobile/update_password',
            '/mobile/upload',
            '/mobile/order/list',
            '/mobile/user_fava',
            '/mobile/user_coupon',
            '/mobile/collect',
            '/mobile/uncollect',
            '/mobile/post/support',
            '/mobile/post/unsupport',
            '/mobile/post/reply',
            '/mobile/post/delete',
            '/mobile/mypost',
            '/mobile/post/save',
            '/mobile/mybook',
            '/mobile/testpaper/read',
            '/mobile/user_test/list',
            '/mobile/user_test/save',
            '/mobile/user_coupon/receive',
            '/mobile/user_coupon/count',
            '/mobile/order/save',
            '/mobile/order/wxpay',
            '/mobile/order/learn',
            '/mobile/user_history/list',
            '/mobile/user_history/update',
            '/mobile/order/flashsale',
            '/mobile/goods/read',
            '/mobile/order/group',
            '/mobile/live_comment/save',

            // pc端
            '/pc/logout',
            '/pc/bind_mobile',
            '/pc/update_info',
            '/pc/update_password',
            '/pc/upload',
            '/pc/order/list',
            '/pc/user_fava',
            '/pc/user_coupon',
            '/pc/collect',
            '/pc/uncollect',
            '/pc/post/support',
            '/pc/post/unsupport',
            '/pc/post/reply',
            '/pc/post/delete',
            '/pc/mypost',
            '/pc/post/save',
            '/pc/mybook',
            '/pc/testpaper/read',
            '/pc/user_test/list',
            '/pc/user_test/save',
            '/pc/user_coupon/receive',
            '/pc/user_coupon/count',
            '/pc/order/save',
            '/pc/order/wxpay',
            '/pc/order/learn',
            '/pc/user_history/list',
            '/pc/user_history/update',
            '/pc/order/flashsale',
            '/pc/goods/read',
            '/pc/order/group',
            '/pc/live_comment/save',
        ]
    }

    // 必须绑定手机号之后才能操作
    config.checkBindPhone = {
        match: [
            // 移动端
            '/mobile/update_info',
            '/mobile/update_password',
            '/mobile/upload',
            '/mobile/order/list',
            '/mobile/user_fava',
            '/mobile/user_coupon',
            '/mobile/collect',
            '/mobile/uncollect',
            '/mobile/post/support',
            '/mobile/post/unsupport',
            '/mobile/post/reply',
            '/mobile/post/delete',
            '/mobile/mypost',
            '/mobile/post/save',
            '/mobile/mybook',
            '/mobile/testpaper/read',
            '/mobile/user_test/list',
            '/mobile/user_test/save',
            '/mobile/user_coupon/receive',
            '/mobile/user_coupon/count',
            '/mobile/order/save',
            '/mobile/order/wxpay',
            '/mobile/order/learn',
            '/mobile/user_history/list',
            '/mobile/user_history/update',
            '/mobile/order/flashsale',
            '/mobile/goods/read',
            '/mobile/order/group',
            '/mobile/live_comment/save',

            // pc端
            '/pc/update_info',
            '/pc/update_password',
            '/pc/upload',
            '/pc/order/list',
            '/pc/user_fava',
            '/pc/user_coupon',
            '/pc/collect',
            '/pc/uncollect',
            '/pc/post/support',
            '/pc/post/unsupport',
            '/pc/post/reply',
            '/pc/post/delete',
            '/pc/mypost',
            '/pc/post/save',
            '/pc/mybook',
            '/pc/testpaper/read',
            '/pc/user_test/list',
            '/pc/user_test/save',
            '/pc/user_coupon/receive',
            '/pc/user_coupon/count',
            '/pc/order/save',
            '/pc/order/wxpay',
            '/pc/order/learn',
            '/pc/user_history/list',
            '/pc/user_history/update',
            '/pc/order/flashsale',
            '/pc/goods/read',
            '/pc/order/group',
            '/pc/live_comment/save',
        ]
    }

    // 验证是否登录
    config.isLogin = {
        //ignore: ['/reg', '/login']
        match: [
            '/admin',
            '/platform'
        ]
    };

    // 验证网校
    config.checkSchool = {
        match: [
            '/admin/s/',
        ]
    };

    // 验证当前网校员工权限
    config.checkStaffAuth = {
        match: [
            '/admin/s/',
        ]
    };
}