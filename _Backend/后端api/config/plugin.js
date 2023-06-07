'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    sequelize: {
        enable: true,
        package: 'egg-sequelize',
    },
    jwt: {
        enable: true,
        package: "egg-jwt"
    },
    redis: {
        enable: true,
        package: 'egg-redis',
    },
    valparams: {
        enable: true,
        package: 'egg-valparams'
    },
    oss: {
        enable: true,
        package: 'egg-oss',
    },
    tenpay: {
        enable: true,
        package: 'egg-tenpay'
    }
};