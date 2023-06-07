'use strict';

const Controller = require('./base');

class School_userController extends Controller {
    // 当前模型
    get model() {
        return this.app.model.SchoolUser
    }

    async getListOptions() {
        let { ctx, app, service } = this;
        let currentUser = ctx.authUser;

        // 关键词
        let { keyword } = ctx.query
        let where = {}
        if (keyword != undefined && keyword) {
            const Op = app.Sequelize.Op
            let k = service.user.getKeyByKeyword(keyword)
            where[k] = k == 'username' ? {
                [Op.like]: `%${keyword}%`
            } : keyword
        }

        return {
            validate: {},
            limit: 10,
            options: {
                where: {
                    school_id: ctx.currentSchool.id
                },
                include: [{
                    model: app.model.User,
                    attributes: ['id', 'username', 'nickname', 'avatar'],
                    where
                }],
                order: [
                    ['id', 'DESC']
                ]
            }
        }
    }

    // 查询单个之前
    async beforeRead(opt) {
        let { app, ctx } = this
        opt.where.school_id = ctx.currentSchool.id
        opt.include = [{
            model: app.model.User,
            attributes: {
                exclude: ['password']
            }
        }]
        return opt
    }
    
    // 查询单个返回数据处理
    async afterRead(data) {
        data.user_level = '无'
        data.user_level_expire = ''
        return data
    }

    // 禁止/开启访问
    async updateAccessStatus() {
        await this.updateByKey('no_access')
    }

    // 禁止/开启评论
    async updateCommentStatus() {
        await this.updateByKey('no_comment')
    }

}

module.exports = School_userController;