'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Platformstaff = app.model.define('platformstaff', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
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
        issuper: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '是否是超级管理员'
        },
        platformrole_ids: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '关联平台角色id',
        },
        created_time: DATE,
        updated_time: DATE,

    });

    Platformstaff.associate = function(models) {
        // 关联用户
        Platformstaff.belongsTo(app.model.User)
    }

    return Platformstaff;
};