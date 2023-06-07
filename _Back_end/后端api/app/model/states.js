'use strict';
const crypto = require('crypto');
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;
    // 配置（重要：一定要配置详细，一定要！！！）
    const States = app.model.define('states', {
        state: {
            type: STRING(22),
            allowNull: false,
            get() {
                const state = this.getDataValue('state');
                const value = this.getDataValue('state_code');
                this.setDataValue('text', state);
                this.setDataValue('value', value);
                return state
            },
        },
        state_code: {
            type: STRING(2),
            allowNull: false,
            primaryKey: true,
        }
    },{
        'timestamps': false,
    });

    // 定义关联关系
    States.associate = function(model) {
        States.hasMany(app.model.Cities, {
            // as: "bfriends", 
            foreignKey: 'state_code',
            sourceKey: "state_code"
        });
    }

    return States;
};