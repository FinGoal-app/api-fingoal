// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, userJwtConfig } = require('../controllers/authController');
const { body } = require('express-validator');
const userJwt = require('../middleware/userJwt');

// Validasi untuk registrasi
const validateRegister = [
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
  body('email').isEmail().withMessage('Email tidak valid'),
];

// Endpoin untuk register
router.post('/register',validateRegister, register);

// Endpoin get data user
router.get('/user', userJwt, userJwtConfig);

// Endpoin Home

// Endpoint untuk login manual
router.post('/login', login);

module.exports = router;