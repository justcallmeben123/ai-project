'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Role = app.model.define('role', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '角色名称',
        },
        role_id: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '角色唯一标识',
            unique: true
        },
        desc: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '描述',
        },
        status: {
            type: INTEGER(1),
            defaultValue: 1,
            comment: '状态',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    Role.associate = function(models) {
        // 关联角色
        Role.hasMany(app.model.RoleAccess);
        Role.belongsToMany(app.model.Access, {
            as: 'accesses',
            through: 'role_access',
            foreignKey: 'role_id'
        })

        Role.belongsToMany(app.model.Access, {
            as: 'menus',
            through: 'role_access',
            foreignKey: 'role_id'
        })
    }

    return Role;
};