'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Notice = app.model.define('notice', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: TEXT,
            allowNull: false,
            defaultValue: '',
            comment: '公告内容',
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
        created_time: {
            type: DATE,
            get() {
                const created_time = this.getDataValue('created_time');
                return app.formatTime(created_time)
            }
        },
        updated_time: DATE,

    });

    return Notice;
};