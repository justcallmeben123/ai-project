'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Course = app.model.define('course', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '课程名称',
        },
        cover: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '课程封面',
        },
        try: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '试看内容（课程介绍）',
        },
        content: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '图文详情（视频地址/mp3地址）',
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
        type: {
            type: STRING(10),
            allowNull: false,
            defaultValue: '',
            comment: '类型：media图文，audio音频，video视频',
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

    return Course;
};