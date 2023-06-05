import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide Email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    trim: true,
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please provide confirm password"],
    trim: true,
    minlength: 8,
    validate: {
      validator: function (ele) {
        return ele === this.password;
      },
      message: "Password and Confrim Password are not same",
    },
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = new mongoose.model("User", userSchema);
