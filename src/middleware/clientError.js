const { body } = require("express-validator");

// Validasi untuk registrasi
const validateRegister = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('nama').notEmpty().withMessage('Name cannot be empty'),
  body('email').isEmail().withMessage('Invalid Email format'),
];
// Validasi untuk login
const validateLogin = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').isEmail().withMessage('Invalid Email format'),
];

// Validasi input income
const validateIncome = [
  body("amount")
    .custom((value) => {
      if (typeof value !== "number") {
        throw new Error("Amount must be a number");
      }
      return true;
    })
    .notEmpty().withMessage("Amount cannot be empty"),
  body("sumber").notEmpty().withMessage("Sumber cannot be empty"),
];

// Validasi input expense
const validateExpense = [
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount must be a number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount cannot be empty"),
  body("tujuan").notEmpty().withMessage("Tujuan cannot be empty"),
];

// Validasi Input saving
const validateSaving = [
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount must be a number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount cannot be empty"),
];

// Validasi input Allocation
const validateAllocation = [
  body("kategori").notEmpty().withMessage("Kategori cannot be empty"),
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount must be a number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount cannot be empty"),
];

// Validasi input Goal
const validateGoal = [
  body("goal").notEmpty().withMessage("Goal cannot be empty"),
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount must be a number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount cannot be empty"),
  body("target").notEmpty().withMessage("Target cannot be empty"),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateIncome,
  validateExpense,
  validateSaving,
  validateAllocation,
  validateGoal,
}