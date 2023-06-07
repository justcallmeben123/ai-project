'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    // 注册
    async reg() {
        let { ctx, app, service } = this;
        // 参数验证
        ctx.validate({
            username: {
                type: 'string',
                required: true,
                range: {
                    min: 5,
                    max: 20
                },
                desc: '用户名'
            },
            password: {
                type: 'string',
                required: true,
                desc: '密码'
            },
            repassword: {
                type: 'string',
                required: true,
                desc: '确认密码'
            }
        }, {
            equals: [
                ['password', 'repassword']
            ]
        });
        let { username, password } = ctx.request.body;
        // 验证用户是否已经存在
        if (await service.user.findByKey('username', username)) {
            ctx.throw(400, '用户名已存在');
        }
        // 创建用户
        let user = await app.model.User.create({
            username,
            password,
        });
        if (!user) {
            ctx.throw(400, '创建用户失败');
        }
        user = JSON.parse(JSON.stringify(user))
        delete user.password
        ctx.apiSuccess(user);
    }


    // 登录
    async login() {
        const { ctx, app, service } = this;
        // 参数验证
        ctx.validate({
            username: {
                type: 'string',
                required: true,
                desc: '用户名'
            },
            password: {
                type: 'string',
                required: true,
                desc: '密码'
            },
        });
        let { username, password } = ctx.request.body;
        // 验证该用户是否存在|验证该用户状态是否启用

        let user = await service.user.findByKey('username', username);
        if (!user) {
            ctx.throw(400, '用户不存在或已被禁用');
        }
        // 验证密码
        if (!app.checkPassword(password, user.password)) {
            this.ctx.throw(400, '密码错误');
        }

        user = JSON.parse(JSON.stringify(user));
        // 生成token
        let token = app.createToken(user);
        user.token = token;
        delete user.password;
        // 加入缓存中
        if (!await service.cache.set('user_' + user.id, token)) {
            ctx.throw(400, '登录失败');
        }
        // 返回用户信息和token
        return ctx.apiSuccess({
            token: user.token
        });
    }

    // 退出登录
    async logout() {
        const { ctx, service } = this;
        // 拿到当前用户id
        let current_user_id = ctx.authUser.id;
        // 移除redis当前用户信息
        if (!await service.cache.remove('user_' + current_user_id)) {
            ctx.throw(400, '你已经退出了');
        }
        ctx.apiSuccess('退出成功');
    }

    // 获取用户相关信息
    async info() {
        const { ctx, service, app } = this;
        let currentUser = JSON.parse(JSON.stringify(ctx.authUser));
        delete currentUser.password
        let roles = []
        let menus = []
        let accesses = []
        
        // 是否是平台人员
        let isplatform = false
        let platformstaff = await app.model.Platformstaff.findOne({
            where: {
                user_id: currentUser.id
            },
            attributes: ['id']
        })
        if (platformstaff) {
            isplatform = true
        }
        
        if (ctx.header.school_id) {
            let res = await service.schoolstaff.getAccessByUid(currentUser.id)
            roles = res.roleKeys
            menus = res.menus
            accesses = res.simple_accesses
        }
        ctx.apiSuccess({
            avatar: currentUser.avatar,
            name: currentUser.nickname || currentUser.username,
            introduction: currentUser.desc,
            roles,
            menus,
            accesses,
            isplatform
        });
    }
}

module.exports = UserController;