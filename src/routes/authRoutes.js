// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/authController');
const { body } = require('express-validator');
const { updatePassword } = require('../models/userModel');

// Validasi untuk registrasi
const validateRegister = [
  body('username').isLength({ min: 3 }).withMessage('Username minimal 3 karakter'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('email').isEmail().withMessage('Email tidak valid'),
];

// Endpoint untuk registrasi manual
router.post('/register', validateRegister, register);
router.post('/update', updatePassword)

// Endpoint untuk login manual
router.post('/login', login);

module.exports = router;
