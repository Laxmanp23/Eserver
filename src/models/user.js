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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt timestamps
  }
);
// Synchronize the model with the database
sequelize
  .sync()
  .then(() => {
    console.log("User model synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing User model:", error);
  });

module.exports = User;
