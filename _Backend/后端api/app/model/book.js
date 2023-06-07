'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Book = app.model.define('book', {
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
        title: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '电子书标题',
        },
        cover: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '电子书封面',
        },
        desc: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '描述',
        },
        try: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '介绍',
        },
        price: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '价格',
        },
        t_price: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '划线价格',
        },
        status: {
            type: INTEGER(1),
            defaultValue: 1,
            comment: '状态',
        },
        sub_count: {
            type: INTEGER,
            defaultValue: 0,
            comment: '订阅量',
        },
        is_single: {
            type: INTEGER(1),
            defaultValue: 1,
            comment: '是否单卖 0否1是',
        },
        created_time: DATE,
        updated_time: DATE,
    });

    Book.associate = function(models) {
        Book.hasMany(app.model.BookDetail)
    }

    return Book;
};