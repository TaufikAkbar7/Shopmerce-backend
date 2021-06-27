const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../../utils");

exports.userRegister = asyncHandler(async (req, res) => {
  const error = validationResult(req);

  //cek apakah terjadi error pada validasi data
  if (!error.isEmpty()) {
    const err = new Error("Invalid value");
    err.errStatus = 400;
    err.data = error.array();
    throw err;
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  if (!user) {
    res.status(400).json({ message: "Error can not add user" });
  }
  const saveUser = await user.save();
  res.status(201).json({
    message: "User Add Success",
    name: saveUser.name,
    email: saveUser.email,
    userRole: saveUser.userRole,
  });
});

exports.updateUserById = asyncHandler(async (req, res) => {
  const error = validationResult(req);

  //cek apakah terjadi error pada validasi data
  if (!error.isEmpty()) {
    const err = new Error("Invalid value");
    err.errStatus = 400;
    err.data = error.array();
    throw err;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const id = req.params.id;
  const userRole = req.body.userRole;

  const user = await User.findById(id);
  if (user) {
    user.name = name;
    user.email = email;
    user.userRole = userRole;
  }
  if (password) {
    user.password = bcrypt.hashSync(password, 8);
  }

  const saveUser = await user.save();
  res.status(200).json({ message: "User has been updated", data: saveUser });
});

exports.updateProfileById = asyncHandler(async (req, res) => {
  const error = validationResult(req);

  //cek apakah terjadi error pada validasi data
  if (!error.isEmpty()) {
    const err = new Error("Invalid value");
    err.errStatus = 400;
    err.data = error.array();
    throw err;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const id = req.user._id;

  const user = await User.findById(id);
  if (user) {
    user.name = name;
    user.email = email;
  }
  if (password) {
    user.password = bcrypt.hashSync(password, 8);
  }

  const saveUser = await user.save();
  res.status(200).json({ message: "User has been updated", data: saveUser });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const getId = req.params.id;
  const getUser = await User.findById(getId);
  if (!getUser) {
    res.status(404).json({ message: "Data not found" });
  }
  res.status(200).json({ message: "Get Data Success", data: getUser });
});

exports.userSignIn = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userRole: user.userRole,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: "Invalid email or password" });
});

exports.getAllUser = asyncHandler(async (req, res) => {
  const sortByDesc = { createdAt: -1 };
  const count = await User.countDocuments();
  const users = await User.find().sort(sortByDesc);
  res.status(200).json({
    message: "Get User Success",
    data: users,
    total_user: count
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.userRole === 1) {
      res.status(400).json({ message: "Can Not Delete Admin User" });
      return;
    }
    const deleteUser = await user.remove();
    res.status(200).json({ message: "User Deleted", user: deleteUser });
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
});
