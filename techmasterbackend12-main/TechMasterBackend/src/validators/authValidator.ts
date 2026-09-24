import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be blank")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const userCreateValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["Super Admin", "Admin", "Editor", "Viewer"])
    .withMessage("Invalid user role assigned"),
];
