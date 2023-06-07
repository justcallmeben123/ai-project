'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL, FLOAT } = app.Sequelize;
    const UserHistory = app.model.define('user_history', {
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
        goods_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '课程id',
        },
        type: {
            type: STRING,
            allowNull: false,
            defaultValue: 'course',
            comment: '类型：course课程，column专栏'
        },
        extra: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '其他参数'
        },
        total_time: {
            type: FLOAT(11, 2),
            allowNull: false,
            defaultValue: 0,
            comment: '学习进度',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    UserHistory.associate = function(models) {
        // 关联课程
        UserHistory.belongsTo(app.model.Course, {
            foreignKey: 'goods_id'
        })

        // 关联专栏
        UserHistory.belongsTo(app.model.Column, {
            foreignKey: 'goods_id'
        })

        // 关联电子书
        UserHistory.belongsTo(app.model.Book, {
            foreignKey: 'goods_id'
        })
    }

    return UserHistory;
};