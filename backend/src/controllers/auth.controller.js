const jwt = require("jsonwebtoken");
const userModel = require("../models/User.model");
const bcrypt = require("bcrypt");
const { cookieOptions } = require("../config/cookie.config");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "credentials missing" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists!" });

    //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });

    res.cookie("accessToken", token, cookieOptions);
    res.status(201).json({ message: "User created successfully", user, token });
  } catch (err) {
    console.error("error in register route", err.message);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "credentials missing" });
    }

    const userExists = await userModel.findOne({ email }).select("+password");
    if (!userExists)
      return res.status(400).json({ message: "Wrong Credentials!" });

    //check if password matches
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch)
      return res.status(400).json({ message: "Wrong Credentials!" });

    const token = jwt.sign({ id: userExists._id }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });

    const user = userExists.toObject();
    delete user.password;
    res.cookie("accessToken", token, cookieOptions);
    res
      .status(201)
      .json({ message: "User logged in successfully", user, token });
  } catch (err) {
    console.error("error in login route", err.message);
  }
};

const authUser = async (req, res) => {
  return res.status(200).json({ user:req.user });
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", cookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in logout route:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, loginUser, authUser , logoutUser};
