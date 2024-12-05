const pool = require("../config/db");

const addIncome = async (id_user, amount, tujuan) => {
  const user = await queryUsers(id_user);
  const balance = user.balance + amount;
  try {
    // menambahkan data kedalam incomes
    const [resultIncomes] = await pool.query(
      "INSERT INTO incomes (id_user, amount, tujuan) VALUES (?, ? ,?)",
      [id_user, amount, tujuan]
    );
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_user, amount, tujuan) VALUES (?, ? ,?)",
      [id_user, amount, tujuan]
    );

    // update balance user
    await pool.query("UPDATE users SET balance = ? WHERE id_user = ?", [
      balance,
      id_user,
    ]);
    const id_incomes = resultIncomes.insertId;
    const savings = user.savings;
    const history = {
      id_incomes: id_incomes,
      id_user: id_user,
      balance: balance,
      savings: savings,
      amount: amount,
      tujuan: tujuan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return history;
  } catch (err) {
    return {
      status: 500,
      message: "Error add income",
    };
  }
};

const addExpense = async (id_user, provider, amount, tujuan) => {
  try {
    // menambahkan data kedalam expenses
    const [resultExpenses] = await pool.query(
      "INSERT INTO expenses (id_user, provider, amount, tujuan) VALUES (?, ?, ?, ?)",
      [id_user, provider, amount, tujuan]
    );

    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_user, amount, tujuan) VALUES (?, ? ,?)",
      [id_user, amount, tujuan]
    );

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
    const history = {
      id_expense: id_expense,
      id_user: id_user,
      balance: balanceUser,
      savings: savingsUser,
      amount: amount,
      tujuan: tujuan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return history;
  } catch (err) {
    return {
      status: 500,
      message: "Error add expense",
    };
  }
};

const getHistory = async (id_user) => {
  const [resultHistory] = await pool.query(
    "SELECT * FROM history WHERE id_user = ? ORDER BY updated_at DESC",
    [id_user]
  );
  return resultHistory;
};

const queryUsers = async (id_user) => {
  const [results] = await pool.query(
    "SELECT * FROM users WHERE id_user = ?", 
    [id_user]
  );
  return results[0];
};

module.exports = {
  addIncome,
  queryUsers,
  addExpense,
  getHistory,
};
