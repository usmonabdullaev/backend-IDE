import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(409).json(errors.array());
    }

    const userPassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userPassword, salt);

    const userBalance = Number(req.body.balance) || 0;

    const doc = new UserModel({
      fullname: req.body.fullname,
      email: req.body.email,
      password: passwordHash,
      balance: userBalance,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "anonymous",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to register",
    });
  }
};

export const auth = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );

    if (!isValidPass) {
      return res.status(403).json({
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "anonymous",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to log in",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { password, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    res.status(500).json({
      message: "No access",
    });
  }
};
