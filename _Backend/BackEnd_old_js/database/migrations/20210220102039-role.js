'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('role', {
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
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('role');
    }
};