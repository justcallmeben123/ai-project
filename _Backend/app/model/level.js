'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Level = app.model.define('level', {
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

    return Level;
};