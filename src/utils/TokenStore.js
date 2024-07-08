// utils/CustomTokenStorage.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Token = sequelize.define(
  "Token",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    // Additional model options can be placed here
  }
);

module.exports = Token;
