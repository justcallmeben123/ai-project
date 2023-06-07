'use strict';
const crypto = require('crypto');
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT, DOUBLE } = app.Sequelize;
    // 配置（重要：一定要配置详细，一定要！！！）
    const CitiesExtended = app.model.define('cities_extended', {
        city: {
            type: STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        state_code: {
            type: STRING(2),
            allowNull: false
        },
        zip: {
            type: INTEGER(5),
            allowNull: false
        },
        latitude: {
            type: DOUBLE,
            allowNull: false
        },
        longitude: {
            type: DOUBLE,
            allowNull: false
        },
        county: {
            type: STRING(50),
            allowNull: false,
            get() {
                const county = this.getDataValue('county');
                const value = this.getDataValue('city');
                this.setDataValue('text', county);
                this.setDataValue('value', value);
                return county
            },
        }
    },{
        'timestamps': false,
    });

    return CitiesExtended;
};