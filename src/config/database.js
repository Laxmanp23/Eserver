
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Add this line to load environment variables

const sequelize = new Sequelize({
  dialect: 'mariadb', // You can change this to 'postgres' or 'sqlite' based on your database choice
  host: process.env.DB_HOST || '129.154.34.108',
  username: process.env.DB_USER || 'ecommerce',
  password: process.env.DB_PASSWORD || 'ecommerce12345',
  database: process.env.DB_NAME || 'ecommerce',
  dialectOptions: {
    // for writing to database india kolkata time
    timezone: 'Asia/Kolkata',
    connectTimeout: 20000,

  },
  // logging: true, // Enable debug logging
});
module.exports = sequelize;