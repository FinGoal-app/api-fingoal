const express = require('express');
const router = express.Router();
const { tambahIncome, tambahExpense } = require('../controllers/moneyController');
const { body } = require('express-validator');

const validateTambahIncome = [
  body('amount')
  .notEmpty().withMessage('Amount tidak boleh kosong').bail()
  .isNumeric().withMessage('Amount harus berupa angka'),
  body('tujuan').notEmpty().withMessage('Tujuan tidak boleh kosong'),
];

const validateTambahExpense = [
  body('provider').notEmpty().withMessage('Provider tidak boleh kosong'),
  body('amount')
  .notEmpty().withMessage('Amount tidak boleh kosong').bail()
  .isNumeric().withMessage('Amount harus berupa angka'),
  body('tujuan').notEmpty().withMessage('Tujuan tidak boleh kosong'),
];

// Endpoin untuk tambahIncome
router.post('/tambahIncome', validateTambahIncome, tambahIncome);

// Endpoin untuk tambahExpense
router.post('/tambahExpense', validateTambahExpense, tambahExpense);

module.exports = router;