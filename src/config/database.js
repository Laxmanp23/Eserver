
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Add this line to load environment variables

const sequelize = new Sequelize({
  dialect: 'mariadb', // You can change this to 'postgres' or 'sqlite' based on your database choice
  host: process.env.DB_HOST ,
  username: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME,
  dialectOptions: {
    // for writing to database india kolkata time
    timezone: '+05:30',
    connectTimeout: 20000,

  },
  logging: true, // Enable debug logging
});
module.exports = sequelize;