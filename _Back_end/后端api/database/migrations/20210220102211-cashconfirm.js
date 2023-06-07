'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT, DECIMAL } = Sequelize;
        return queryInterface.createTable('cashconfirm', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            school_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '所属网校id',
                references: {
                    model: 'school',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            cash_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '收款账户id',
            },
            price: {
                type: DECIMAL(10, 2),
                defaultValue: 0,
                comment: '提现金额',
            },
            status: {
                type: INTEGER(1),
                allowNull: false,
                defaultValue: 0,
                comment: '状态'
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('cashconfirm');
    }
};