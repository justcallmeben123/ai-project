'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
        return queryInterface.createTable('book_detail', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '电子书id',
                references: {
                    model: 'book',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            title: {
                type: STRING(100),
                allowNull: false,
                defaultValue: '',
                comment: '章节',
            },
            content: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '内容',
            },
            isfree: {
                type: INTEGER(1),
                defaultValue: 0,
                comment: '是否试读：0否1是',
            },
            orderby: {
                type: INTEGER,
                defaultValue: 10,
                comment: '排序',
            },
            created_time: DATE,
            updated_time: DATE,

        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('book_detail');
    }
};