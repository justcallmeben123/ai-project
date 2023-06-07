'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT, DECIMAL } = Sequelize;
        return queryInterface.createTable('level', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '套餐名称',
            },
            price: {
                type: DECIMAL(10, 2),
                defaultValue: 0.00,
                comment: '价格',
            },
            desc: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '套餐描述',
            },
            weight: {
                type: INTEGER,
                defaultValue: 0,
                comment: '套餐权重',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('level');
    }
};