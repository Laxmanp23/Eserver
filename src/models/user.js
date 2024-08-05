const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
/**
 * Defines the User model.
 * @param {Object} sequelize - The Sequelize instance.
 * @param {Object} DataTypes - The data types module.
 * @returns {Object} - The User model.
 */

const User = sequelize.define(
  "User",
  {
   username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role:{
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "user",
    }
  },
  {
    timestamps: true, // This will add createdAt and updatedAt timestamps
  }
);
module.exports = User;
