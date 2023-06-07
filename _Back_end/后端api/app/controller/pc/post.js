'use strict';

const Controller = require('../base');

class PostController extends Controller {
    // 格式化返回数据
    formatItem(item) {
        const { ctx, app } = this
        item.desc = item.desc ? JSON.parse(item.desc) : {
            images: [],
            text: "暂无描述"
        }
        if (item.user) {
            item.user.name = item.user.nickname || item.user.username || item.user.phone
            delete item.user.username
            delete item.user.nickname
            delete item.user.phone
        }
        item.created_time = app.formatTime(item.created_time)
        item.issupport = item.post_supports ? !!item.post_supports.length : false
        if (ctx.authUser) {
            delete item.post_supports
        }

        if (item.content) {
            item.content = JSON.parse(item.content)
        }

        return item
    }

    // 获取用户关联（用户登录后，获取关联点赞情况）
    getInclude() {
        const { app, ctx } = this
        let include = [{
            model: app.model.User,
            attributes: ["phone", "id", "username", "nickname", "avatar", "sex"],
            where: {
                status: 1,
            },
            required: true
        }]

        // 用户登录，获取点赞情况
        if (ctx.authUser) {
            include.push({
                model: app.model.PostSupport,
                where: {
                    user_id: ctx.authUser.id
                },
                attributes: ['id'],
                required: false
            })
        }
        return include
    }

    // 我的帖子列表
    async myPostList() {
        const { ctx, app } = this

        const school_id = ctx.currentSchool.id
        const user_id = ctx.authUser.id
        let where = {
            school_id,
            user_id
        }

        let include = this.getInclude()

        let res = await this.list(app.model.Post, {
            where,
            attributes: ["id", "bbs_id", "desc", "user_id", "comment_count", "support_count", "is_top", "created_time"],
            include,
            order: [
                ['is_top', 'DESC'],
                ['id', 'DESC']
            ],
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => this.formatItem(item)),
        })
    }

    // 帖子列表
    async index() {
        const { ctx, app } = this

        const school_id = ctx.currentSchool.id

        // const user_id = ctx.authUser.id

        let where = {
            school_id,
        }

        // 关键词
        const { keyword, bbs_id, is_top } = ctx.query
        if (keyword != undefined && keyword != '') {
            const Op = app.Sequelize.Op
            where.desc = {
                [Op.like]: `%${keyword}%`
            }
        }

        if (bbs_id != undefined && bbs_id != '' && bbs_id != 0) {
            where.bbs_id = bbs_id
            
            // 演示数据，可以删除
            if(ctx.currentSchool.id == 11){
                if(!([65,66,67,68,69,70,71,72].includes(parseInt(bbs_id)))){
                    this.ctx.throw(400,'当前社区ID不存在')
                }
            }
            
        } else {
            // 演示数据，可以删除
            if(ctx.currentSchool.id == 11){
                where.bbs_id = {
                    [app.Sequelize.Op.in]: [65,66,67,68,69,70,71,72]
                }
            }
        }

        let include = this.getInclude()

        let order = [
            ['id', 'DESC']
        ]

        if (is_top == 1) {
            order.unshift(['is_top', 'DESC'])
        }

        let res = await this.list(app.model.Post, {
            where,
            attributes: ["id", "bbs_id", "desc", "user_id", "comment_count", "support_count", "is_top", "created_time"],
            include,
            order
        })

        ctx.apiSuccess({
            count: res.count,
            rows: res.rows.map(item => this.formatItem(item)),
        })
    }

    async read() {
        let { ctx, app } = this

        let { id } = ctx.query

        let school_id = ctx.currentSchool.id
        let where = {
            id,
            school_id,
        }

        let include = this.getInclude()

        // 演示数据，可以删除
        if(ctx.currentSchool.id == 11){
            where.bbs_id = {
                [app.Sequelize.Op.in]: [65,66,67,68,69,70,71,72]
            }
        }

        let res = await this.findOne(app.model.Post, {
            where,
            attributes: ["id", "desc", "content", "user_id", "comment_count", "support_count", "is_top", "created_time"],
            include,
        })

        if (res) {
            res = this.formatItem(res)
        }

        ctx.apiSuccess(res)
    }

    // 发布帖子
    async save() {
        let { ctx, app } = this;

        ctx.validate({
            bbs_id: {
                type: "int",
                required: true,
                desc: "社区ID"
            },
            content: {
                type: "array",
                required: true,
                desc: "帖子内容"
            },
        })

        const user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id
        let { bbs_id, content } = ctx.request.body

        // 演示数据，可以删除
        if(ctx.currentSchool.id == 11){
            if(!([65,66,67,68,69,70,71,72].includes(parseInt(bbs_id)))){
                this.ctx.throw(400,'当前社区ID不存在')
            }
        }

        // content数据内容验证
        if (content.length == 0) {
            ctx.throw(400, '帖子内容不能为空')
        }
        content = content.map(o => {
            let ks = Object.keys(o)
            if (!ks.includes('text') || !ks.includes('images')) {
                ctx.throw(400, 'content数组对象中必须包含text和images')
            }
            o.text = o.text.trim()
            if (o.text == '') {
                ctx.throw(400, '帖子内容不能为空')
            }
            if (!Array.isArray(o.images)) {
                ctx.throw(400, 'content数组对象中的images必须是数组')
            }
            return {
                text: o.text,
                images: o.images
            }
        })

        const desc = content.length ? JSON.stringify(content[0]) : null

        // 社区ID是否存在
        if (!(await app.model.Bbs.findOne({
                where: {
                    id: bbs_id,
                    status: 1
                }
            }))) {
            ctx.throw(400, '社区ID不存在')
        }

        let addData = {
            school_id,
            bbs_id,
            content: JSON.stringify(content),
            user_id,
            desc
        }

        ctx.apiSuccess(await app.model.Post.create(addData))
    }

    // 删除帖子
    async delete() {
        let { ctx, app } = this;

        ctx.validate({
            id: {
                type: "int",
                required: true,
                desc: "帖子"
            },
        });

        let { id } = ctx.request.body;
        
        // 演示数据，可以删除
        if(ctx.currentSchool.id == 11){
            if([29,30,32,33,34,35,36].includes(parseInt(id))){
                this.ctx.throw(400,'当前为演示贴子，禁止删除')
            }
        }
        
        const user_id = ctx.authUser.id
        const school_id = ctx.currentSchool.id

        let res = await app.model.Post.destroy({
            where: {
                id,
                user_id,
                school_id
            }
        })

        ctx.apiSuccess(res);
    }

}

module.exports = PostController;