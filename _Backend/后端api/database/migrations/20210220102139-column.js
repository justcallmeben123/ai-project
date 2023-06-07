'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT, DECIMAL } = Sequelize;
        return queryInterface.createTable('column', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: STRING(30),
                allowNull: false,
                defaultValue: '',
                comment: '专栏标题',
            },
            cover: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '专栏封面',
            },
            try: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '描述',
            },
            content: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '图文详情',
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
            status: {
                type: INTEGER(1),
                defaultValue: 1,
                comment: '状态',
            },
            isend: {
                type: INTEGER(1),
                defaultValue: 0,
                comment: '是否已完结 0连载中 1已完结',
            },
            sub_count: {
                type: INTEGER,
                defaultValue: 0,
                comment: '订阅量',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('column');
    }
};