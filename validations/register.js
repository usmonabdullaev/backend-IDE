import { body } from "express-validator";

export const registerValidation = [
  body("fullname", "Enter your name").isLength({ min: 3 }),
  body("email", "Invalid email format").isEmail(),
  body("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
  body("balance", "Enter only the number").optional().isNumeric(),
];
