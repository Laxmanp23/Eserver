const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const User = require("../models/user");
const TokenStore =require("../utils/TokenStore")
const bodyParser = require("body-parser");
const app = express();

// Parse application/json
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// registerUser
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    // Check for existing user
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = crypto.randomBytes(48).toString('hex');
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Set token to expire in 1 hour

    // Save token in the database
    await TokenStore.create({
      userId: user.id,
      token: token,
      expirationTime: expiration
    });
    res.status(201).json({
      message: "User successfully registered",
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to register user", error: err.message });
  }
};

// Authenticate user and get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
