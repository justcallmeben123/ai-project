'use strict';
const crypto = require('crypto');
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;
    // 配置（重要：一定要配置详细，一定要！！！）
    const Cities = app.model.define('cities', {
        city: {
            type: STRING(50),
            allowNull: false,
            primaryKey: true,
            get() {
                const city = this.getDataValue('city');
                this.setDataValue('text', city);
                this.setDataValue('value', city);
                return city
            },
        },
        state_code: {
            type: STRING(2),
            allowNull: false
        }
    },{
        'timestamps': false,
    });

    Cities.associate = function(model) {
        Cities.hasMany(app.model.CitiesExtended, {
            // as: "bfriends", 
            foreignKey: 'county',
            sourceKey: "city"
        });
    }

    return Cities;
};