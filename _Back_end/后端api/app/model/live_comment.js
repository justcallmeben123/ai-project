'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL, FLOAT } = app.Sequelize;
    const LiveComment = app.model.define('live_comment', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '弹幕内容'
        },
        live_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '直播间id',
            references: {
                model: 'live',
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
        color: {
            type: STRING(7),
            allowNull: false,
            defaultValue: '',
            comment: '弹幕颜色'
        },
        time: {
            type: FLOAT,
            allowNull: false,
            defaultValue: '',
            comment: '弹幕时间'
        },
        created_time: DATE,
        updated_time: DATE,
    });

    LiveComment.associate = function(models) {
        // 关联用户
        LiveComment.belongsTo(app.model.User)
    }

    return LiveComment;
};