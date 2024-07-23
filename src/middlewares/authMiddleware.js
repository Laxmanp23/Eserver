const user = require("../models/user");
const { Op } = require("sequelize");
const TokenStore = require("../utils/TokenStore");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
    .status(401)
    .json({ error: "Unauthorized - No Authorization header provided" });
  }
  
  const token = authHeader.replace("Bearer ", "");
  // console.log("Token:", token);
  // console.log(authHeader)

  try {
    const tokenData = await TokenStore.findOne({
      where: {
        token,
        expirationTime: {
          [Op.gte]: new Date(), // Check if the token is not expired
        },
      },
    });

    if (!tokenData) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    req.user = tokenData.userId;
    req.token = token;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(401).json({
      message: "Not authorized to access this resource",
    });
  }
};

module.exports = authMiddleware;
