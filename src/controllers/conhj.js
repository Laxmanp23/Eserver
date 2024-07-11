// src/controllers/AuthController.js
const crypto = require("crypto");
const { Op } = require("sequelize");
const CustomTokenStorage = require("../utils/CustomTokenStorage");


// Function to generate a unique token
const generateToken = () => crypto.randomBytes(32).toString("hex");

// Function to set token expiration time to 360 minutes = 6 hours from now
const setExpirationTime = () => Date.now() + 360 * 60 * 1000;

// Function to hash the password
const hashPassword = (password, salt) => {
  salt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
};

// Function to check if a user with the given username or email already exists
const doesUserExist = async (username, email) => {
  return await User.findOne({
    where: {
      [Op.or]: [
        { username: { [Op.eq]: username } },
        { email: { [Op.eq]: email } },
      ],
    },
  });
};

const handleLogin = async (username, password, res) => {
  const user = await User.findOne({ where: { username } });

  if (user) {
    const { salt, password: storedPassword, role, name, shop_id, shop_name } = user;
    const { hash } = hashPassword(password, salt);

    if (storedPassword === hash) {
      const token = generateToken();
      const expirationTime = setExpirationTime();

      const existingToken = await CustomTokenStorage.findOne({
        where: { username },
      });

      if (existingToken) {
        await existingToken.update({ token, expirationTime });
      } else {
        await CustomTokenStorage.create({
          token,
          username,
          shop_id,
          expirationTime,
        });
      }

      return res.status(200).json({
        error: false,
        message: "Login successful",
        name,
        role,
        shop_id,
        shop_name,
        token,
        expirationTime,
      });
    } else {
      return res
        .status(401)
        .json({ error: true, message: "Invalid credentials User & Passwords" });
    }
  } else {
    return res
      .status(401)
      .json({ error: true, message: "Invalid credentials" });
  }
};

// Function to handle user registration
const handleRegistration = async (userData, res) => {
  const { username, password, email } = userData;

  const existingUser = await doesUserExist(username, email);

  if (existingUser) {
    return res
      .status(400)
      .json({ error: true, message: "Username or email already exists" });
  }

  const { hash, salt } = hashPassword(password);


  const newUser = await User.create({
    ...userData,
    password: hash,
    salt,
  });

  const token = generateToken();
  const expirationTime = setExpirationTime();

  await CustomTokenStorage.create({
    token,
    username: newUser.username,
    role: newUser.role,
    shop_id: newUser.shop_id,
    expirationTime,
  });

  return res.status(201).json({
    error: false,
    message: "Account registered successfully",
    token,
    shop_id: newUser.shop_id,
    expirationTime,
  });
};

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await handleLogin(username, password, res);
      // res.json(result); // Don't return the result here, handle it inside the function
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  register: async (req, res) => {
    const userData = req.body;

    try {
      const result = await handleRegistration(userData, res);
      // res.json(result); // Don't return the result here, handle it inside the function
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};

module.exports = authController;