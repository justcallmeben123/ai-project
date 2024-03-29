'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const PostSupport = app.model.define('post_support', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
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
        user_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '用户id',
            references: {
                model: 'user',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        created_time: DATE,
        updated_time: DATE,
    });

    return PostSupport;
};