module.exports = (option, app) => {
    return async(ctx, next) => {
        //1. 获取 header 头token
        const { token } = ctx.header;

        if (!token) {
            ctx.throw(400, '您没有权限访问该接口!');
        }
        //2. 根据token解密，换取用户信息
        let user = {};
        try {
            user = app.checkToken(token);
        } catch (error) {
            // let fail = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
            let fail = "Token 令牌不合法，请重新登录";
            ctx.throw(400, fail);
        }

        // // 判断当前用户服务端是否登录
        // let t = await ctx.service.cache.get('user_' + user.id);
        // if (!t || t !== token) {
        //     ctx.throw(400, 'Token 令牌不合法，请重新登录');
        // }

        let currentUser = await app.model.User.findByPk(user.id);
        if (!currentUser) {
            ctx.throw(400, '用户不存在')
        }
        // 把 user 信息挂载到全局ctx上
        ctx.authUser = currentUser;

        // 是否是当前网校用户
        let school_id = ctx.currentSchool.id
        let school_user = await app.model.SchoolUser.findOne({
            where: {
                school_id,
                user_id: user.id
            },
        })

        // 不是当前网校用户
        if (!school_user) {
            ctx.throw(400, '当前网校用户不存在');
        }

        // 用户已被禁用
        if (school_user.no_access == 1) {
            ctx.throw(400, '该用户已被禁用');
        }
        ctx.authSchoolUser = school_user

        await next();
    }
}