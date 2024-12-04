// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

// Validasi untuk registrasi
const validateRegister = [
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('email').isEmail().withMessage('Email tidak valid'),
];

// Endpoin untuk register
router.post('/register', validateRegister, register);

// Endpoint untuk login manual
router.post('/login', login);

module.exports = router;
