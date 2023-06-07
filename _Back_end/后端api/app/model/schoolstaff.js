'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Schoolstaff = app.model.define('schoolstaff', {
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
        iscreator: {
            type: INTEGER(1),
            defaultValue: 0,
            comment: '是否为创建人 0否1是',
        },
        role_ids: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '关联角色id',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    Schoolstaff.associate = function(models) {
        // 关联用户
        Schoolstaff.belongsTo(app.model.User)

        // 关联网校
        Schoolstaff.belongsTo(app.model.School)
    }

    return Schoolstaff;
};