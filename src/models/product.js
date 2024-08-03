const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

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
    type: DataTypes.TEXT, // Changed from STRING to TEXT for longer descriptions
    allowNull: false,
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imageUrl: {
    type: DataTypes.STRING, // URL to the image of the product
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: {
    //   model: 'Categories', // Assumes a Categories model exists
    //   key: 'id',
    // }
  },
  userId: { // Foreign key referencing User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // This is the table name of the User model
      key: 'id',
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING, // Stock Keeping Unit for inventory management
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'discontinued'), // Product status
    defaultValue: 'active',
  }
}, {
  timestamps: true, // Enable timestamps to see when a product was created or updated
});

module.exports = Product;
