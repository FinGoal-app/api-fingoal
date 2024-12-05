const moneyModel = require("../models/moneyModel");

const tambahIncome = async (req, res) => {
  const { amount, sumber } = req.body;
  const id_user = req.user.id_user;

  try {
    const numericAmount = +amount;
    const history = await moneyModel.addIncome(id_user, numericAmount, sumber);

    res.status(201).json({
      message: "Income berhasil ditambahkan",
      data: history,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const tambahExpense = async (req, res) => {
  const { provider, amount, tujuan } = req.body;
  const id_user = req.user.id_user;

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
          message: "Expense berhasil ditambahkan",
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
          message: "Expense berhasil ditambahkan",
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
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const tambahSaving = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { amount } = req.body;

    const history = await moneyModel.addSavings(id_user, amount);
    res.status(201).json({
      message: "Saving berhasil ditambahkan",
      data: history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const tambahAllocation = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { amount, kategori } = req.body;
    const history = await moneyModel.addAllocation(id_user, kategori, amount);
    res.status(201).json({
      message: "Allocation berhasil ditambahkan",
      data: history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const tambahGoal = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { goal, amount, target, description } = req.body;
    const history = await moneyModel.addGoals(id_user, goal, amount, target, description);
    res.status(201).json({
      message: "Goals berhasil ditambahkan",
      data: history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const tampilHistory = async (req, res) => {
  try {
    const id_user = req.user.id_user;

    const data = await moneyModel.getHistory(id_user);
    res.status(200).json({
      message: "Berhasil mengambil data history",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

module.exports = {
  tambahIncome,
  tambahExpense,
  tampilHistory,
  tambahSaving,
  tambahAllocation,
  tambahGoal,
};
