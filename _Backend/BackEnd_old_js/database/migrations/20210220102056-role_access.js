'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('role_access', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            access_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '权限id',
                references: {
                    model: 'access',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            role_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '角色id',
                references: {
                    model: 'role',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('role_access');
    }
};