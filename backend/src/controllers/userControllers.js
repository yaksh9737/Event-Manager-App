const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, user.username),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, user.username),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Get Logged In User
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
};

module.exports = { registerUser, loginUser, getUserProfile };
