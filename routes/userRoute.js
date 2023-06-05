import express from "express";
import {
  authenticate,
  signIn,
  signup,
} from "../controllers/authenticationController.js";
export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(signIn);
router.route("/authenticate").get(authenticate);
