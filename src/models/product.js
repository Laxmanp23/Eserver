// src/models/product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

// src/models/product.js
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  userId: { // Foreign key referencing User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // This is the table name of the User model
      key: 'id',
    }
  }
}, {
  timestamps: false, // Enable timestamps to see when a product was created
});


// const Product = sequelize.define('Product', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   inStock: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
// }, {
//   timestamps: false, // Set to true if you want Sequelize to manage createdAt and updatedAt
// });

module.exports = Product;

