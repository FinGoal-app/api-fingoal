const { validationResult } = require("express-validator");
const moneyModel = require("../models/moneyModel");

const tambahIncome = async (req, res) => {
  const { amount, sumber } = req.body;
  const id_user = req.user.id_user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const numericAmount = +amount;
    const income = await moneyModel.addIncomes(id_user, numericAmount, sumber);

    res.status(201).json({
      message: "Income successfully added",
      addIncome: income,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tambahExpense = async (req, res) => {
  const { amount, tujuan } = req.body;
  const id_user = req.user.id_user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const numericAmount = +amount;
    const user = await moneyModel.queryUsers(id_user);
    const balance = user.balance;

    if (balance >= numericAmount) {
      const expense = await moneyModel.addExpenses(
        id_user,
        numericAmount,
        tujuan
      );

      res.status(201).json({
        message: "Expense successfully added",
        addExpense: expense,
      });
    } else {
      res.status(400).json({
        message: "Insufficient balance or savings",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tambahSaving = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id_user = req.user.id_user;
    const { id_goal, amount } = req.body;
    const goal = await moneyModel.queryGoals(id_goal);
    const current_saving = goal.amount - goal.saving_goal;
    const finished = goal.finished;

    if (finished === 1) {
      return res.status(400).json({
        message: "Goal achieved",
      });
    }

    if (amount > current_saving) {
      return res.status(400).json({
        message: "Saving must be less than or equal to the remaining money",
      });
    }

    const numericAmount = +amount;
    const saving = await moneyModel.addSavings(id_user, id_goal, numericAmount);
    res.status(201).json({
      message: "Saving successfully added",
      addSaving: saving,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tambahAllocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id_user = req.user.id_user;
    const { amount, kategori } = req.body;
    const numericAmount = +amount;
    const allocation = await moneyModel.addAllocations(
      id_user,
      kategori,
      numericAmount
    );
    res.status(201).json({
      message: "Allocation successfully added",
      addAllocation: allocation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const ubahAllocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { amount, kategori } = req.body;
    const id = req.params.id;
    const id_user = req.user.id_user;
    const numericAmount = +amount;
    const allocation = await moneyModel.updateAllocation(
      id,
      numericAmount,
      kategori,
      id_user
    );
    res.status(200).json({
      message: "Allocation successfully updated",
      updateAllocation: allocation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const hapusAllocation = async (req, res) => {
  try {
    const id = req.params.id;
    const id_user = req.user.id_user;
    const allocation = await moneyModel.deleteAllocation(id, id_user);
    res.status(200).json({
      message: "Allocation successfully deleted",
      deleteAllocation: allocation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tampilAllocation = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const allocation = await moneyModel.getAllocation(id_user);
    res.status(200).json({
      message: "Allocation data successfully displayed",
      showAllocation: allocation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tambahGoal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id_user = req.user.id_user;
    const { goal, amount, target, description } = req.body;
    const numericAmount = +amount;

    const data = await moneyModel.addGoals(
      id_user,
      goal,
      numericAmount,
      target,
      description
    );
    res.status(201).json({
      message: "Goal successfully added",
      addGoal: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const ubahGoal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id_user = req.user.id_user;
    const id = req.params.id;
    const { goal, amount, target, description } = req.body;
    const numericAmount = +amount;
    const data = await moneyModel.updateGoal(
      id,
      goal,
      numericAmount,
      target,
      description,
      id_user
    );
    res.status(200).json({
      message: "Goals successfully updated",
      updateGoal: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const hapusGoal = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const id = req.params.id;

    const data = await moneyModel.deleteGoal(id, id_user);
    res.status(200).json({
      message: "Goal successfully deleted",
      deleteGoal: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tampilGoal = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const goals = await moneyModel.getGoal(id_user);
    res.status(200).json({
      message: "Goals successfully displayed",
      showGoal: goals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tampilHistory = async (req, res) => {
  try {
    const id_user = req.user.id_user;

    const data = await moneyModel.getHistory(id_user);
    res.status(200).json({
      message: "History data successfully displayed",
      showHistory: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const tampilHome = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const data = await moneyModel.getHome(id_user);
    res.status(200).json({
      message: "Home successfully displayed",
      showHome: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
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
  tampilAllocation,
  tambahGoal,
  ubahGoal,
  hapusGoal,
  tampilGoal,
  tampilHome,
};
