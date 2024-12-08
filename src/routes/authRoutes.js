// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, userJwtConfig } = require('../controllers/authController');
const inputClient = require('../middleware/clientError');
const userJwt = require('../middleware/userJwt');

// Endpoin untuk register
router.post('/register', inputClient.validateRegister, register);

// Endpoin get data user
router.get('/user', userJwt, userJwtConfig);

// Endpoin Home

// Endpoint untuk login manual
router.post('/login', inputClient.validateLogin, login);

module.exports = router;