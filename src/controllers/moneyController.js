const moneyModel = require("../models/moneyModel");

const tambahIncome = async (req, res) => {
  const { amount, sumber } = req.body;
  const id_user = req.user.id_user;

  try {
    const numericAmount = +amount;
    const history = await moneyModel.addIncomes(id_user, numericAmount, sumber);

    res.status(201).json({
      message: "Income berhasil ditambahkan",
      addIncome: history,
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
        const history = await moneyModel.addExpenses(
          id_user,
          provider,
          numericAmount,
          tujuan
        );

        res.status(201).json({
          message: "Expense berhasil ditambahkan",
          addExpense: history,
        });
      } else {
        res.status(400).json({
          message: "Saldo atau Tabungan tidak cukup",
        });
      }
    } else {
      if (savings >= numericAmount) {
        const history = await moneyModel.addExpenses(
          id_user,
          provider,
          numericAmount,
          tujuan
        );

        res.status(201).json({
          message: "Expense berhasil ditambahkan",
          addExpense: history,
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
      addSaving: history,
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
    const history = await moneyModel.addAllocations(id_user, kategori, amount);
    res.status(201).json({
      message: "Allocation berhasil ditambahkan",
      addAllocation: history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const ubahAllocation = async (req, res) => {
  try {
    const { amount, kategori } = req.body;
    const id = req.params.id;
    const id_user = req.user.id_user;

    const history = await moneyModel.updateAllocation(
      id,
      amount,
      kategori,
      id_user
    );
    res.status(200).json({
      message: "Allocation berhasil diubah",
      updateAllocation: history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const hapusAllocation = async (req, res) => {
  try {
    const id = req.params.id;
    const id_user = req.user.id_user;
    const history = await moneyModel.deleteAllocation(id, id_user);
    res.status(200).json({
      message: "Allocation berhasil dihapus",
      deleteAllocation: history,
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
    const amountNum = Number(amount);
    const targetNum = Number(target);
    console.log(amountNum);
    console.log(targetNum);
    
    const history = await moneyModel.addGoals(
      id_user,
      goal,
      amountNum,
      targetNum,
      description
    );
    res.status(201).json({
      message: "Goals berhasil ditambahkan",
      addGoal: history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const ubahGoal = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const id = req.params.id;
    const { goal, amount, target, description } = req.body;
    const history = await moneyModel.updateGoal(
      id,
      goal,
      amount,
      target,
      description,
      id_user
    );
    res.status(200).json({
      message: "Goals berhasil diubah",
      updateGoal: history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const hapusGoal = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const id = req.params.id;
    
    const history = await moneyModel.deleteGoal(id, id_user);
    res.status(200).json({
      message: "Goals berhasil dihapus",
      deleteGoal: history,
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
      showHistory: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: err.message,
    });
  }
};

const tampilHome = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const data = await moneyModel.getHome(id_user);
    res.status(200).json({
      message: "Berhasil mengambil data home",
      showHome: data,
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
  ubahAllocation,
  hapusAllocation,
  tambahGoal,
  ubahGoal,
  hapusGoal,
  tampilHome,
};
