const { body } = require("express-validator");

// Validasi untuk registrasi
const validateRegister = [
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('email').isEmail().withMessage('Email tidak valid'),
];
// Validasi untuk login
const validateLogin = [
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('email').isEmail().withMessage('Email tidak valid'),
];

// Validasi input income
const validateIncome = [
  body("amount")
    .custom((value) => {
      if (typeof value !== "number") {
        throw new Error("Amount harus berupa number");
      }
      return true;
    })
    .notEmpty().withMessage("Amount tidak boleh kosong"),
  body("sumber").notEmpty().withMessage("Sumber tidak boleh kosong"),
];

// Validasi input expense
const validateExpense = [
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount harus berupa number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount tidak boleh kosong"),
  body("tujuan").notEmpty().withMessage("Tujuan tidak boleh kosong"),
];

// Validasi Input saving
const validateSaving = [
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount harus berupa number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount tidak boleh kosong"),
];

// Validasi input Allocation
const validateAllocation = [
  body("kategori").notEmpty().withMessage("Kategori tidak boleh kosong"),
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount harus berupa number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount tidak boleh kosong"),
];

// Validasi input Goal
const validateGoal = [
  body("goal").notEmpty().withMessage("Goal tidak boleh kosong"),
  body("amount")
  .custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Amount harus berupa number");
    }
    return true;
  })
  .notEmpty().withMessage("Amount tidak boleh kosong"),
  body("target").notEmpty().withMessage("Target tidak boleh kosong"),
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