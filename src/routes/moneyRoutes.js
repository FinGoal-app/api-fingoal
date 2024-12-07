const express = require('express');
const router = express.Router();
const { 
  tambahIncome, 
  tambahExpense, 
  tampilHistory, 
  tambahSaving,
  tambahAllocation,
  tambahGoal,
  tampilHome,
  ubahAllocation,
  ubahGoal,
  hapusAllocation,
  hapusGoal,
  tampilGoal
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
// Endpoin untuk ubahAllocation
router.put('/allocation/:id', userJwt, ubahAllocation);
// Endpoin untuk hapusAllocation
router.delete('/allocation/:id', userJwt, hapusAllocation);

// Endpoin untuk tambahGoal
router.post('/goal', userJwt, tambahGoal);
// Endpoin untuk ubahGoal
router.put('/goal/:id', userJwt, ubahGoal);
// Endpoin untuk hapusGoal
router.delete('/goal/:id', userJwt, hapusGoal);
// Endpoin untuk mengambil data Goal
router.get('/goal', userJwt, tampilGoal);

// Endpoin untuk mengambil data history
router.get('/history', userJwt, tampilHistory);

// Endpoin untuk menampilkan data di home
router.get('/home', userJwt, tampilHome);

module.exports = router;