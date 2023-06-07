'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const SchoolUser = app.model.define('school_user', {
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
        no_comment: {
            type: INTEGER(1),
            defaultValue: 0,
            comment: '禁止评论 0否1禁止',
        },
        no_access: {
            type: INTEGER(1),
            defaultValue: 0,
            comment: '禁止访问 0否1禁止',
        },
        total_consume: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '消费总额',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    SchoolUser.associate = function(models) {
        // 关联用户
        SchoolUser.belongsTo(app.model.User)

    }

    return SchoolUser;
};