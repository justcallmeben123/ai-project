'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const PostComment = app.model.define('post_comment', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        school_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '网校id',
            references: {
                model: 'school',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        post_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '所属帖子id',
            references: {
                model: 'post',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        content: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '评论内容',
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
        reply_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '回复id',
        },
        reply_user: {
            type: STRING,
            allowNull: true,
            comment: '回复用户',
        },
        is_top: {
            type: INTEGER(1),
            defaultValue: 0,
            comment: '是否置顶 0否1是',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    PostComment.associate = function(models) {
        // 关联用户
        PostComment.belongsTo(app.model.User)

        // 关联回复
        PostComment.hasMany(app.model.PostComment, {
            foreignKey: 'reply_id'
        })
    }

    return PostComment;
};