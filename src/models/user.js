const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//variabel template type data string
const defaultString = {
  type: String,
  required: true,
};

//variabel template type data number
const defaultNumber = {
  type: Number,
  required: true,
  default: 0
};

const UserSchema = new Schema(
  {
    name: defaultString,
    email: { type: String, required: true, unique: true },
    password: defaultString,
    userRole: defaultNumber
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;