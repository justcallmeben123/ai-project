'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL,VIRTUAL } = app.Sequelize;
    const Live = app.model.define('live', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: STRING(30),
            allowNull: false,
            defaultValue: '',
            comment: '直播名称',
        },
        cover: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '直播封面',
        },
        try: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '直播介绍',
        },
        key: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '唯一标识',
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
        sub_count: {
            type: INTEGER,
            defaultValue: 0,
            comment: '订阅量',
        },
        status: {
            type: INTEGER(1),
            defaultValue: 1,
            comment: '状态',
        },
        type: {
            type: VIRTUAL,
            get() {
                return "live"
            }
         },
        start_time: DATE,
        end_time: DATE,
        created_time: DATE,
        updated_time: DATE,

    });

    return Live;
};