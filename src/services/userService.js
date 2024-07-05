const { User } = require('../models');

exports.createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

exports.getUser = async (userId) => {
  const user = await User.findByPk(userId);
  return user;
};
