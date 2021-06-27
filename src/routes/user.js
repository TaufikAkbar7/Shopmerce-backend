const express = require("express");
const { isAuth, isAdmin } = require("../../utils.js");
const {
  getAllUser,
  getUserById,
  userRegister,
  userSignIn,
  deleteUser,
  updateUserById,
  updateProfileById,
} = require("../controllers/user.js");
const router = express.Router();

//read -> get all user
router.get("/", isAuth, getAllUser);

//read -> get user by id
router.get("/:id", isAuth, getUserById);

//put -> update user
router.put("/profile", isAuth, updateProfileById);

router.put("/updateUser/:id", isAuth, updateUserById);

//post -> post user
router.post("/register", userRegister);

//post -> post sign in
router.post("/login", userSignIn);

//delete -> delete user
router.delete("/delete/:id", deleteUser);

module.exports = router;
