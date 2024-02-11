import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const add = async (req, res) => {
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

    const currentBalance = user._doc.balance;
    const new_balance = Number(currentBalance) + Number(req.body.balance);

    const newUser = await UserModel.findOneAndUpdate(
      { email: req.body.email },
      { balance: new_balance },
      { new: true }
    );
    const { password, ...userData } = newUser._doc;
    res.json(userData);
  } catch (err) {
    res.status(500).json({
      message: "Failed to log in",
    });
  }
};

export const minus = async (req, res) => {
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

    const currentBalance = user._doc.balance;
    const new_balance = Number(currentBalance) - Number(req.body.balance);

    const newUser = await UserModel.findOneAndUpdate(
      { email: req.body.email },
      { balance: new_balance },
      { new: true }
    );
    const { password, ...userData } = newUser._doc;
    res.json(userData);
  } catch (err) {
    res.status(500).json({
      message: "Failed to log in",
    });
  }
};
