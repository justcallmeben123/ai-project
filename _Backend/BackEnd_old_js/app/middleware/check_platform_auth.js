module.exports = (option, app) => {
    return async(ctx, next) => {
        // 判断当前用户是否有访问权限
        let hasAuth = await ctx.service.platformstaff.hasAccessByUid(ctx.authUser.id)
        if (!hasAuth) {
            ctx.throw(400, '你不是平台人员，禁止访问');
        }

        await next();
    }
}