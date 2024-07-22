const user = require("../models/user");
const { Op } = require("sequelize");
const TokenStore = require("../utils/TokenStore");
const authMiddleware = async (req, res, next) => {
 
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const tokenData = await TokenStore.findOne({
      where: {
        token,
        expirationTime: {
          [Op.gte]: new Date(), // Check if the token is not expired
        },
      },
    });
    if (tokenData) {
      
      if (tokenData) {
        req.user = tokenData.userId;
        req.token = token;
        console.log(req.user)

        next();
      } else {
        return res.status(401).json({ error: "Unauthorized - Invalid User" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(401).json({
      message: "Not authorized to access this resource",});
  }
};
module.exports = authMiddleware;