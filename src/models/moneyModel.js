const e = require("express");
const pool = require("../config/db");

const addIncomes = async (id_user, amount, sumber) => {
  const user = await queryUsers(id_user);
  const balance = user.balance + amount;

  try {
    // menambahkan data kedalam incomes
    const [resultIncomes] = await pool.query(
      "INSERT INTO incomes (id_user, amount, sumber) VALUES (?, ? ,?)", [ 
        id_user, 
        amount, 
        sumber
      ]);
    const kategori = 'income'
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_user,kategori, amount, label) VALUES (?,?, ? ,?)", [
        id_user,
        kategori, 
        amount, 
        sumber
      ]);

    // update balance user
    await pool.query("UPDATE users SET balance = ? WHERE id_user = ?", [
      balance,
      id_user,
    ]);
    const id_incomes = resultIncomes.insertId;
    const savings = user.savings;
    const income = {
      id_incomes: id_incomes,
      id_user: id_user,
      balance: balance,
      savings: savings,
      amount: amount,
      sumber: sumber,
      created_at: new Date().toISOString(),
    };
    return income;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addExpenses = async (id_user, provider, amount, tujuan) => {
  try {
    // menambahkan data kedalam expenses
    const [resultExpenses] = await pool.query(
      "INSERT INTO expenses (id_user, provider, amount, tujuan) VALUES (?, ?, ?, ?)", [
        id_user, 
        provider, 
        amount, 
        tujuan
      ]);

    const kategori = 'expense';
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_user,kategori, amount, label) VALUES (? ,? ,? ,?)",[
        id_user,
        kategori, 
        amount, 
        tujuan
      ]);

    const user = await queryUsers(id_user);
    // update balance pada user
    if (provider === "balance") {
      const balance = user.balance - amount;
      await pool.query("UPDATE users SET balance = ? WHERE id_user = ?", [
        balance,
        id_user,
      ]);
    } else {
      const savings = user.savings - amount;
      await pool.query("UPDATE users SET savings = ? WHERE id_user = ?", [
        savings,
        id_user,
      ]);
    }
    const newUserData = await queryUsers(id_user);
    const balanceUser = newUserData.balance;
    const savingsUser = newUserData.savings;
    const id_expense = resultExpenses.insertId;
    const expense = {
      id_expense: id_expense,
      id_user: id_user,
      balance: balanceUser,
      savings: savingsUser,
      amount: amount,
      tujuan: tujuan,
      created_at: new Date().toISOString(),
    };
    return expense;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addSavings = async (id_user, amount) => {
  try {
    const user = await queryUsers(id_user);
    const savings = user.savings + amount;
    await pool.query("UPDATE users SET savings = ? WHERE id_user = ?", [
      savings, 
      id_user
    ]);
    
    const kategori = 'savings';
    const label = 'savings';
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_user ,kategori, amount, label) VALUES (? ,? ,? ,?)",[
        id_user,
        kategori, 
        amount, 
        label
    ]);

    const newUserData = await queryUsers(id_user);
    const savingsUser = newUserData.savings;
    const saving = {
      id_user: id_user,
      savings: savingsUser,
      kategori: kategori,
      amount: amount,
      label: label,
      created_at: new Date().toISOString(),
    }

    return saving;

  } catch (err) {
    throw new Error(err.message);
  }
}

const addAllocations = async (id_user, kategori, amount) => {
  try {
    const user = await queryUsers(id_user);
    const [resultAllocation] = await pool.query("INSERT INTO allocations (id_user, kategori, amount) VALUES(?, ?, ?)", [
      id_user, 
      kategori, 
      amount
    ]);
    const jmlAllocation = user.amount_allocation + amount;
    await pool.query('UPDATE users SET amount_allocation = ? WHERE id_user = ?', [
      jmlAllocation,
      id_user
    ]);
    const newUserData = await queryUsers(id_user);
    const newJmlAllocation = newUserData.amount_allocation;
    const allocation = {
      id_allocation: resultAllocation.insertId,
      id_user: id_user,
      kategori: kategori,
      amount: amount,
      amount_allocation: newJmlAllocation,
      created_at: new Date().toISOString()
    }

    return allocation;

  } catch (err) {
    throw new Error(err.message);
  }
}

const addGoals = async (id_user, goal, amount, target, description) => {
  try {
    const status = 'progress';
    const [resultGoal] = await pool.query("INSERT INTO goals (id_user, status, goal, amount, target, description) VALUES(?, ? ,? ,?, ?, ?)", [
      id_user,
      status,
      goal,
      amount,
      target,
      description
    ]);
    const dataGoal = {
      id_goal: resultGoal.insertId,
      id_user: id_user,
      status: status,
      goal: goal,
      amount: amount,
      target: target,
      description: description,
      created_at: new Date().toISOString,
    }
    return dataGoal;
  } catch (err) {
    throw new Error(err.message);
  }
}

const getHistory = async (id_user) => {
  const [resultHistory] = await pool.query(
    "SELECT * FROM history WHERE id_user = ? ORDER BY updated_at DESC", [
      id_user
  ]);
  return resultHistory;
};

const queryUsers = async (id_user) => {
  const [results] = await pool.query(
    "SELECT * FROM users WHERE id_user = ?",
    id_user
  );
  return results[0];
};

module.exports = {
  addIncomes,
  queryUsers,
  addExpenses,
  getHistory,
  addSavings,
  addAllocations,
  addGoals
};
