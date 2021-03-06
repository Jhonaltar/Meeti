const Sequelize = require('sequelize');
require('dotenv').config({path: 'variables.env'});

module.exports = new Sequelize (process.env.BD_NOMBRE, process.env.BD_USER,process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
          require: true, 
          rejectUnauthorized: false
        }
      },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

/* module.exports = new Sequelize ('meeti', 'postgres','root', {
    host: '127.0.0.1',
    port: '5432',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
}); */
