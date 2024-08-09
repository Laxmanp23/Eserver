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
const adminMiddleware = async (req, res, next) => {
  try {
    console.log("Admin Middleware: Checking user role");
    const User = await user.findByPk(req.user);
    if (!User) {
      console.log("Admin Middleware: User not found");
      return res.status(404).json({ message: "User not found" });
    }
    if (User.role !== "admin") {
      console.log(`Admin Middleware:${user.role} User role, not admin`);
      console.log(User.role);
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }
    console.log("Admin Middleware: User is admin");
    console.log(User.role);
    next();
  } catch (error) {
    console.error("Error in adminMiddleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};

// Middleware working two middleware 
// 1 authMiddleware
// 2 adminmiddleware