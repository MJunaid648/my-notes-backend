import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  return res.status(statusCode).json({
    status: 1,
    token,
    user,
  });
};

export const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.send({ status: 0 });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ data: "Invalid Email or Password" });
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ data: "Incorrect Email or Password" });
    }
    createSendToken(user, 200, res);
  } catch (error) {
    res.send({ status: 0 });
  }
};

export const protect = async (req, res, next) => {
  let token;
  // 1) Get Token
  if (!req.headers.cookie) {
    return res.send({ status: 0 }).status(401);
  }
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";");
  // Find the cookie that contains the JWT token
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "jwt") {
      token = value;
      break;
    }
  }
  console.log(token);
  // 2) Verify JWT Token (Validity & Expire)
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  // 3) Check User exist or deleted
  const userExist = await User.findOne({ _id: verified.id });
  req.user = userExist;

  console.log(userExist);
  next();
};

export const authenticate = async (req, res, next) => {
  let token;
  // 1) Get Token
  if (!req.headers.cookie) {
    return res.send({ status: 0 }).status(401);
  }
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split(";");
  // Find the cookie that contains the JWT token
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "jwt") {
      token = value;
      break;
    }
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: verified.id });
  if (user) {
    return res.status(200).json({
      status: 1,
      token,
      user,
    });
  } else {
    res.send({
      status: 0,
    });
  }
};
