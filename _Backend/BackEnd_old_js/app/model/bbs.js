'use strict';
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DECIMAL } = app.Sequelize;
    const Bbs = app.model.define('bbs', {
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
        title: {
            type: STRING,
            allowNull: false,
            defaultValue: '',
            comment: '社群标题'
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

    Bbs.associate = function(models) {
        // 关联管理员
        Bbs.hasMany(app.model.BbsManager, {
            foreignKey: 'bbs_id'
        });

        Bbs.belongsToMany(app.model.User, {
            as: 'managers',
            through: 'bbs_manager',
            foreignKey: 'bbs_id'
        })
    }

    return Bbs;
};