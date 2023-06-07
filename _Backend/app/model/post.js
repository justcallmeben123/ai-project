'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Post = app.model.define('post', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        school_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '所属网校id',
            references: {
                model: 'school',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        bbs_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '所属社群id',
            references: {
                model: 'bbs',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        desc: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '描述',
        },
        content: {
            type: TEXT('medium'),
            allowNull: false,
            defaultValue: '',
            comment: '帖子内容',
        },
        user_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '发帖人id',
            references: {
                model: 'user',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        comment_count: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '评论数'
        },
        support_count: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '点赞数'
        },
        is_top: {
            type: INTEGER(1),
            defaultValue: 0,
            comment: '是否置顶 0否1是',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    Post.associate = function(models) {
        // 关联用户
        Post.belongsTo(app.model.User)

        // 关联社区
        Post.belongsTo(app.model.Bbs, {
            as: "bbs",
            foreignKey: 'bbs_id'
        })

        // 关联点赞
        Post.hasMany(app.model.PostSupport)
    }

    return Post;
};