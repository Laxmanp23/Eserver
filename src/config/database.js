

// config/db.js
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//   dialect: 'mariadb',  // Replace with your dialect, e.g., 'mysql'
//   host: '129.154.34.108',    // Replace with your host
//   port: 3000,           // Replace with your database port
//   username: 'ecommerce',  // Replace with your database username
//   password: 'ecommerce12345',  // Replace with your database password
//   database: 'ecommerce',  // Replace with your database name
// });

// module.exports = sequelize;


const { Sequelize } = require('sequelize');
// require('dotenv').config(); // Add this line to load environment variables

const sequelize = new Sequelize({
  dialect: 'mariadb', // You can change this to 'postgres' or 'sqlite' based on your database choice
  host: process.env.DB_HOST || '129.154.34.108',
  username: process.env.DB_USER || 'ecommerce',
  password: process.env.DB_PASSWORD || 'ecommerce12345',
  database: process.env.DB_NAME || 'ecommerce',
  dialectOptions: {
    // for writing to database india kolkata time
    timezone: '+05:30',
    connectTimeout: 20000,

  },
  logging: true, // Enable debug logging
});

//  console.log("DB_HOST:", process.env.DB_HOST);

module.exports = sequelize;