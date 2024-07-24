const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const TokenStore = require("../utils/TokenStore");
const bodyParser = require("body-parser");
const app = express();
// registerUser
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  // Validate input fields
  if (!username || !email || !password) {
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
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    // Generate token
    const token = crypto.randomBytes(48).toString("hex");
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 360); // Set token to expire in 15days
    // Save token in the database
    await TokenStore.create({
      username: user.username,
      userId: user.id,
      token: token,
      expirationTime: expiration,
    });
    // save user detail
    res.status(201).json({
      message: "User successfully registered",
      userData: {
        id: user.id,
        username: user.username,
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

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "username password not match" });
    }
    if (isMatch) {
      let token = await TokenStore.findOne({ where: { userId: user.id } });
      console.log();
      if (token) {
        if ((token.expirationTime = new Date())) {
          token.token = crypto.randomBytes(48).toString("hex");
          token.expirationTime = new Date();
          token.expirationTime.setHours(token.expirationTime.getHours() + 360);
          await token.save();
        }
      } else {
        token = await TokenStore.update({
          username: user.username,
          userId: user.id,
          token: crypto.randomBytes(48).toString("hex"),
          expirationTime: new Date(),
        });
        token.expirationTime.setHours(token.expirationTime.getHours() + 360);
      }
      res.status(200).json({
        message: "User successfully logged in",
        userData: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token: token.token,
        expiretime: token.expirationTime,
        userId : token.userId,
        id : token.id,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

//user logout function
const logoutUser = async (req, res) => {
  if ((token.expirationTime = new Date())) {
    // token.token = crypto.randomBytes(48).toString("hex");
    token.expirationTime = new Date();
    token.expirationTime.setHours(token.expirationTime.getHours() + 0);
    await token.save();
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
