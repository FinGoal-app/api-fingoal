const moneyModel = require("../models/moneyModel");
const { validationResult } = require("express-validator");

const tambahIncome = async (req, res) => {
  const { amount, tujuan } = req.body;
  const { id_user } = req.user.id_user;

  // Cek Validasi Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const numericAmount = +amount;
    const history = await moneyModel.addIncome(id_user, numericAmount, tujuan);

    res.status(201).json({
      message: "Berhasil menambahkan income",
      data: history,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

const tambahExpense = async (req, res) => {
  const { id_user, provider, amount, tujuan } = req.body;

  // Cek validasi Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const numericAmount = +amount;
    const user = await moneyModel.queryUsers(id_user);
    const balance = user.balance;
    const savings = user.savings;

    if (provider === "balance") {
      if (balance >= numericAmount) {
        const history = await moneyModel.addExpense(
          id_user,
          provider,
          numericAmount,
          tujuan
        );

        res.status(201).json({
          message: "Berhasil menambahkan Expense",
          data: history,
        });
      } else {
        res.status(400).json({
          message: "Saldo atau Tabungan tidak cukup",
        });
      }
    } else {
      if (savings >= numericAmount) {
        const history = await moneyModel.addExpense(
          id_user,
          provider,
          numericAmount,
          tujuan
        );

        res.status(201).json({
          message: "Berhasil menambahkan Expense",
          data: history,
        });
      } else {
        res.status(400).json({
          message: "Saldo atau Tabungan tidak cukup",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

const tampilHistory = async (req, res) => {
  try {
    const id_user = req.body;

    const data = await moneyModel.getHistory(id_user);
    res.status(200).json({
      message: "Berhasil mengambil data history",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

module.exports = {
  tambahIncome,
  tambahExpense,
  tampilHistory
};
