'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    // 过滤角色id
    async filterIds(ids) {
            let { app } = this;
            let rows = await app.model.User.findAll({
                where: {
                    id: ids
                },
                attributes: ['id']
            })
            rows = app.toArray(rows)

            return rows.map(item => item.id)
        }
        // 根据 关键词获取key
    getKeyByKeyword(val) {
            let { ctx } = this
            let k = {}
            if (ctx.isPhone(val)) {
                k = 'phone'
            } else if (ctx.isEmail(val)) {
                k = 'email'
            } else {
                k = 'username'
            }
            return k
        }
        // 根据 手机/邮箱/用户名查询用户是否存在
    async findByKeyword(val) {
            let { ctx, app } = this
            let k = this.getKeyByKeyword(val)

            let user = await this.findByKey(k, val, 1)
            if (!user) {
                ctx.throw(404, '该用户不存在')
            }
            return user
        }
        // 根据指定key值查询单个用户
    async findByKey(key = 'id', value = 0, status = false) {
        let { app } = this;
        let where = {}
        where[key] = value
        if (typeof status == 'number') {
            where.status = status
        }
        return await app.model.User.findOne({ where })
    }
    async isExist(id, status = false) {
            let { ctx, app } = this;
            let d = await this.findByKey('id', id, status)
            if (!d) {
                ctx.throw(404, '当前用户不存在或已被禁用')
            }
            return d
        }
        // 账号密码登录
    async loginByAccount(beforeLogin = null) {
        const { ctx, app, service } = this;
        // 参数验证
        ctx.validate({
            username: {
                type: 'string',
                required: true,
                desc: '用户名/手机/邮箱'
            },
            password: {
                type: 'string',
                required: true,
                desc: '密码'
            },
        });
        let { username, password } = ctx.request.body;
        // 验证该用户是否存在|验证该用户状态是否启用

        let user = await this.findByKeyword(username);
        // let k = this.getKeyByKeyword(username)
        // let where = {
        //     status:1
        // }
        // if(k === "phone" || k === "email"){
        //     where[app.Sequelize.Op.or] = {
        //         username:username,
        //         [k]:username
        //     }
        // }
        // let user  = await app.model.User.findOne({ where })
        
        if (!user) {
            ctx.throw(400, '用户不存在或已被禁用');
        }
        // 验证密码
        if (!app.checkPassword(password, user.password)) {
            ctx.throw(400, '密码错误');
        }

        user = JSON.parse(JSON.stringify(user));

        // 登录前验证
        if (beforeLogin && typeof beforeLogin == 'function') {
            await beforeLogin(user)
        }

        // 生成token
        let token = app.createToken(user);
        user.token = token;
        delete user.password;
        // 加入缓存中
        if (!await service.cache.set('user_' + user.id, token)) {
            ctx.throw(400, '登录失败');
        }
        // 返回用户信息和token
        return user
    }

    // 账号密码注册
    async registerByAccount() {
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
        return user
    }

    // 根据微信unionid登录
    async loginByWechatUnionid(d) {
        const { ctx, app, service } = this
        // 验证用户是否已经存在
        let u = await this.findByKey('weixin_unionid', d.unionid)

        // 已存在
        if (u) {
            if (u.status == 0) {
                ctx.throw(400, '当前用户已被禁用');
            }
        }
        // 不存在，则新增用户
        else {
            // 创建用户
            u = await app.model.User.create({
                username:null,
                nickname: d.nickname,
                avatar: d.headimgurl,
                weixin_unionid: d.unionid,
                sex: d.sex == 1 ? '男' : '女',
                status: 1
            });
            if (!u) {
                ctx.throw(400, '创建用户失败');
            }
        }

        // 绑定当前网校
        let school_id = ctx.currentSchool.id
        let where = {
            school_id,
            user_id: u.id,
        }
        
        console.log("---------------where--------------")
        console.log(where)
        let school_user = await app.model.SchoolUser.findOne({ where })

        // 用户关联网校
        if (!school_user) {
            await app.model.SchoolUser.create(where)
        } else if (school_user.no_access == 1) {
            // 用户已被禁用
            ctx.throw(400, '该用户已被禁用');
        }

        u = JSON.parse(JSON.stringify(u))

        // 生成token
        let token = app.createToken(u);
        u.token = token;
        delete u.password;
        delete u.weixin_unionid

        // 加入缓存中
        if (!await service.cache.set('user_' + u.id, token)) {
            ctx.throw(400, '登录失败');
        }
        // 返回用户信息和token
        return u;
    }
}

module.exports = UserService;