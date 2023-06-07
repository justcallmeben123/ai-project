'use strict';

const Controller = require('egg').Controller;
class UserController extends Controller {
    // 注册
    async reg() {
        let { ctx, app, service } = this;
        // 注册
        let user = await service.user.registerByAccount()
        ctx.apiSuccess(user);
    }


    // 登录
    async login() {
        const { ctx, app, service } = this;
        // 登录
        let user = await service.user.loginByAccount(async(u) => {
            // 绑定当前网校
            let school_id = ctx.currentSchool.id
            let where = {
                school_id,
                user_id: u.id,
            }
            let school_user = await app.model.SchoolUser.findOne({
                where
            })

            // 用户关联网校
            if (!school_user) {
                await app.model.SchoolUser.create(where)
                return
            }
            // 用户已被禁用
            if (school_user.no_access == 1) {
                ctx.throw(400, '该用户已被禁用');
            }
        })

        // 返回用户信息和token
        return ctx.apiSuccess(user);
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

    // 绑定手机号
    async bindMobile() {
        const { ctx, service, app } = this

        ctx.validate({
            phone: {
                type: "phone",
                required: true,
                desc: '手机号'
            },
            code: {
                type: "int",
                required: true,
                desc: '验证码'
            }
        })

        let { phone, code } = ctx.request.body

        // 验证码是否正确
        await service.alisms.verifyCode(phone, code)

        // 手机号是否已被绑定
        let u = await app.model.User.findOne({
            where: {
                phone
            },
            attributes: ['id']
        })

        if (u) {
            ctx.throw(400, '该手机号已被绑定')
        }

        // 绑定当前用户
        ctx.authUser.phone = phone
        await ctx.authUser.save()
        ctx.apiSuccess(app.hiddenPhone(phone))
    }

    // 获取验证码
    async getCaptcha() {
        const { ctx, service, app } = this

        ctx.validate({
            phone: {
                type: "phone",
                required: true,
                desc: '手机号'
            }
        })

        // 发送验证码
        let res = await service.alisms.send(ctx.request.body.phone)

        // 关闭验证码发送
        if (!app.config.aliSMS.isopen) {
            return ctx.apiSuccess(res)
        }

        if (res.Code != 'OK') {
            ctx.throw(400, '发送失败')
        }
        ctx.apiSuccess('ok')
    }

    // 微信/小程序登录
    async weixinLogin() {
        const { ctx, service, app } = this

        let { type } = ctx.request.body

        let rules = {}
        if (type == 'app') {
            rules = {
                access_token: {
                    type: "string",
                    required: true
                },
                openid: {
                    type: "string",
                    required: true
                }
            }
        } else if (type == 'mp') {
            rules = {
                code: {
                    type: "string",
                    required: true
                },
                rawData: {
                    type: "string",
                    required: true
                },
            }
        }

        ctx.validate({
            type: {
                type: "string",
                required: true,
                range: { in: ["app", "mp"]
                }
            },
            ...rules
        })

        let { access_token, openid, code, rawData } = ctx.request.body


        let d = null

        if (type == 'mp') {
            let o = await ctx.getMpOpenId(code)
            rawData = JSON.parse(rawData)
            rawData.unionid = o.unionid
            rawData.nickname = rawData.nickName
            rawData.sex = rawData.gender
            rawData.headimgurl = rawData.avatarUrl
            d = rawData
        } else if (type == 'app') {
            // 根据access_token, openid获取用户相关信息
            d = await ctx.getWechatUserInfoByOpenId(access_token, openid)
        }

        // {
        //     openid: 'oSX1Is1swRi6Rmzk0MnrEZPSIstI',
        //     nickname: '楚绵',
        //     sex: 1,
        //     language: 'zh_CN',
        //     city: 'Guangzhou',
        //     province: 'Guangdong',
        //     country: 'CN',
        //     headimgurl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/icyianiaCq6lUHicrZic8g92MbYd1tHjiaO9ibaFQHRvrIyCVC96bB9OnXMd4N98kr6JNTfYuP4npIQjMwHRzMFtWZqlQ/132',
        //     unionid: 'oZ01y51tUluFOQVPJpDe-CgBKLeY'
        //   }

        if (!d) {
            ctx.throw(400, '登录失败')
        }

        ctx.apiSuccess(await service.user.loginByWechatUnionid(d))
    }

    // 找回密码
    async forget() {
        const { ctx, service, app } = this

        ctx.validate({
            phone: {
                type: "phone",
                required: true,
                desc: '手机号'
            },
            code: {
                type: "int",
                required: true,
                desc: '验证码'
            },
            password: {
                type: "string",
                required: true,
                desc: '密码',
                range: {
                    min: 6,
                    max: 30
                }
            },
            repassword: {
                type: "string",
                required: true,
                desc: '确认密码'
            }
        })

        let { phone, code, password, repassword } = ctx.request.body

        // 密码和确认密码不一致
        if (password != repassword) {
            ctx.throw(400, '密码和确认密码不一致')
        }

        // 该手机号未绑定
        let u = await app.model.User.findOne({
            where: {
                phone,
            },
        })

        if (!u) {
            ctx.throw(400, '该手机号对应账号不存在')
        }

        if (u.id == 1) {
            ctx.throw(400, '演示账号，禁止修改')
        }

        // 手机号错误
        if (u.getDataValue('phone') != phone) {
            ctx.throw(400, '手机号不正确')
        }

        // 验证码是否正确
        await service.alisms.verifyCode(phone, code)

        // 修改密码
        u.password = password
        await u.save()

        // 清除redis中的token
        await service.cache.remove('user_' + u.id)

        ctx.apiSuccess('ok')
    }

    // 修改密码
    async updatePassword() {
        const { ctx, service, app } = this

        if (ctx.authUser.id == 1) {
            ctx.throw(400, '演示账号，禁止修改')
        }

        ctx.validate({
            opassword: {
                type: "string",
                required: true,
                desc: '原密码'
            },
            password: {
                type: "string",
                required: true,
                desc: '密码',
                range: {
                    min: 6,
                    max: 30
                }
            },
            repassword: {
                type: "string",
                required: true,
                desc: '确认密码'
            }
        })

        let { opassword, password, repassword } = ctx.request.body

        // 原密码不正确
        if (!app.checkPassword(opassword, ctx.authUser.password)) {
            ctx.throw(400, '原密码错误');
        }

        // 密码和确认密码不一致
        if (password != repassword) {
            ctx.throw(400, '密码和确认密码不一致')
        }

        // 修改密码
        ctx.authUser.password = password
        await ctx.authUser.save()

        // 清除redis中的token
        await service.cache.remove('user_' + ctx.authUser.id)

        ctx.apiSuccess('ok')
    }

    // 修改资料
    async updateInfo() {
        const { ctx, service, app } = this

        if (ctx.authUser.id == 1) {
            ctx.throw(400, '演示账号，禁止修改')
        }

        ctx.validate({
            avatar: {
                type: "url",
                required: false,
                desc: "头像"
            },
            nickname: {
                type: "string",
                required: true,
                desc: "昵称"
            },
            sex: {
                type: "string",
                required: true,
                desc: "性别",
                range: { in: ['未知', '男', '女']
                }
            },
        })

        let { avatar, nickname, sex } = ctx.request.body

        if (avatar) {
            ctx.authUser.avatar = avatar
        }
        ctx.authUser.nickname = nickname
        ctx.authUser.sex = sex

        await ctx.authUser.save()

        ctx.apiSuccess('ok')

    }

    // 获取用户信息
    async getinfo(){
        let user = this.ctx.authUser
        if(user){
            user = JSON.parse(JSON.stringify(user))
            delete user.password
        }
        this.ctx.apiSuccess(user)
    }

}

module.exports = UserController;