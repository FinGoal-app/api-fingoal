const express = require("express");
const router = express.Router();
const moneyController = require("../controllers/moneyController");
const userJwt = require("../middleware/userJwt");
const inputClient = require('../middleware/clientError');
const { userJwtConfig } = require("../controllers/authController");

router.get("/", userJwt, userJwtConfig);

// Endpoin untuk tambahIncome
router.post("/income", userJwt, inputClient.validateIncome, moneyController.tambahIncome);

// Endpoin untuk tambahExpense
router.post("/expense", userJwt, inputClient.validateExpense, moneyController.tambahExpense);

// Endpoin untuk tambahSaving
router.post("/saving", userJwt, inputClient.validateSaving, moneyController.tambahSaving);

// Endpoin untuk tambahAllocation
router.post("/allocation", userJwt, inputClient.validateAllocation, moneyController.tambahAllocation);
// Endpoin untuk ubahAllocation
router.put("/allocation/:id", userJwt, inputClient.validateAllocation, moneyController.ubahAllocation);
// Endpoin untuk hapusAllocation
router.delete("/allocation/:id", userJwt, moneyController.hapusAllocation);
// Endpoin untuk mengambil data Allocation
router.get("/allocation", userJwt, moneyController.tampilAllocation);

// Endpoin untuk tambahGoal
router.post("/goal", userJwt, inputClient.validateGoal, moneyController.tambahGoal);
// Endpoin untuk ubahGoal
router.put("/goal/:id", userJwt, inputClient.validateGoal, moneyController.ubahGoal);
// Endpoin untuk hapusGoal
router.delete("/goal/:id", userJwt, moneyController.hapusGoal);
// Endpoin untuk mengambil data Goal
router.get("/goal", userJwt, moneyController.tampilGoal);

// Endpoin untuk mengambil data history
router.get("/history", userJwt, moneyController.tampilHistory);

// Endpoin untuk menampilkan data di home
router.get("/home", userJwt, moneyController.tampilHome);

module.exports = router;
