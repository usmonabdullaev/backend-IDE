import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { registerValidation } from "./validations/register.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as BalanceController from "./controllers/BalanceController.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error:", err));

const app = express();

app.use(express.json());

app.post("/register", registerValidation, UserController.register);

app.post("/auth", UserController.auth);

app.get("/auth/me", checkAuth, UserController.getMe);

app.put("/add", BalanceController.add);

app.put("/minus", BalanceController.minus);

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log("Server OK");
});
