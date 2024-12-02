// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/authController');
const { body } = require('express-validator');
const { updatePassword } = require('../models/userModel');

// Validasi untuk registrasi
const validateRegister = [
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('email').isEmail().withMessage('Email tidak valid'),
];

const validateUpdatePassword = [
  body('passwordLama').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('passwordBaru').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

// Endpoint untuk registrasi manual
router.post('/register', validateRegister, register);
router.post('/update',validateUpdatePassword ,updatePassword);

// Endpoint untuk login manual
router.post('/login', login);

module.exports = router;
