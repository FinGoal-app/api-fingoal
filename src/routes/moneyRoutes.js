const express = require('express');
const router = express.Router();
const { 
  tambahIncome, 
  tambahExpense, 
  tampilHistory, 
  tambahSaving,
  tambahAllocation,
  tambahGoal
} = require('../controllers/moneyController');
const userJwt = require('../middleware/userJwt');
const { userJwtConfig } = require('../controllers/authController');

router.get('/', userJwt, userJwtConfig);

// Endpoin untuk tambahIncome
router.post('/income', userJwt, tambahIncome);

// Endpoin untuk tambahExpense
router.post('/expense', userJwt, tambahExpense);

// Endpoin untuk tambahSaving
router.post('/saving', userJwt, tambahSaving);

// Endpoin untuk tambahAllocation
router.post('/allocation', userJwt, tambahAllocation);

// Endpoin untuk tambahGoal
router.post('/goal', userJwt, tambahGoal);

// Endpoin untuk mengambil data history
router.get('/history', userJwt, tampilHistory);

module.exports = router;