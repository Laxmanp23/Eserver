const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", 
    {
      username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // },
  }
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
    // username: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    // },
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    // },
    // password: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
  });
// Synchronize the model with the database
sequelize.sync()
  .then(() => {
    console.log('User model synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing User model:', error);
  });
  return User;
};
