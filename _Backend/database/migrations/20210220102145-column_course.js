'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT, DECIMAL } = Sequelize;
        return queryInterface.createTable('column_course', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true
            },
            column_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '专栏id',
                references: {
                    model: 'column',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            course_id: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '课程id',
                references: {
                    model: 'course',
                    key: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'restrict', // 更新时操作
            },
            look_count: {
                type: INTEGER,
                defaultValue: 0,
                comment: '访问数',
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
        return queryInterface.dropTable('column_course');
    }
};