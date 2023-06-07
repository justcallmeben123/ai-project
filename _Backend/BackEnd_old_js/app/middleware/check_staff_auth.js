module.exports = (option, app) => {
    return async(ctx, next) => {
        // 判断当前用户是否有访问权限
        let hasAuth = await ctx.service.schoolstaff.hasAccessByUid(ctx.authUser.id)
        
        if (!hasAuth) {
            ctx.throw(400, '当前用户没有访问权限');
        }

        await next();
    }
}