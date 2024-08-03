const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categories', // This self-reference is what makes the hierarchy possible
      key: 'id'
    }
  }
}, {
  timestamps: true // Enable timestamps to see when a category was created or updated
});

module.exports = Category;
