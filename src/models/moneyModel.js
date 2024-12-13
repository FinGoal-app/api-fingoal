const pool = require("../config/db");
const { nanoid } = require("nanoid");

const addIncomes = async (id_user, amount, sumber) => {
  const user = await queryUsers(id_user);
  const balance = user.balance + amount;
  const id_income = `icm${nanoid(6)}`;
  const id_history = `h${nanoid(6)}y`;

  try {
    // menambahkan data kedalam incomes
    await pool.query(
      "INSERT INTO incomes (id_income, id_user, amount, sumber) VALUES (?, ?, ? ,?)",
      [id_income, id_user, amount, sumber]
    );
    const kategori = "income";
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_history, id_user,kategori, amount, label) VALUES (?, ?, ?, ? ,?)",
      [id_history, id_user, kategori, amount, sumber]
    );

    // update balance user
    await pool.query("UPDATE users SET balance = ? WHERE id_user = ?", [
      balance,
      id_user,
    ]);
    const savings = user.savings;
    const income = {
      id_incomes: id_income,
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

const addExpenses = async (id_user, amount, tujuan) => {
  try {
    const id_expens = `exp${nanoid(6)}`;
    const id_history = `h${nanoid(6)}y`;
    // menambahkan data kedalam expenses
    await pool.query(
      "INSERT INTO expenses (id_expense, id_user, amount, tujuan) VALUES (?, ?, ?, ?)",
      [id_expens, id_user, amount, tujuan]
    );

    const kategori = "expense";
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_history, id_user,kategori, amount, label) VALUES (?, ? ,? ,? ,?)",
      [id_history, id_user, kategori, amount, tujuan]
    );

    const user = await queryUsers(id_user);
    const balance = user.balance - amount;
    await pool.query("UPDATE users SET balance = ? WHERE id_user = ?", [
      balance,
      id_user,
    ]);

    const newUserData = await queryUsers(id_user);
    const balanceUser = newUserData.balance;
    const expense = {
      id_expense: id_expens,
      id_user: id_user,
      balance: balanceUser,
      amount: amount,
      tujuan: tujuan,
      created_at: new Date().toISOString(),
    };
    return expense;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addSavings = async (id_user, id_goal, amount) => {
  try {
    const user = await queryUsers(id_user);
    const savings = user.savings + amount;
    const goal = await queryGoals(id_goal);
    const sisa = goal.amount - goal.saving_goal - amount;
    const saving_goal = goal.saving_goal + amount;

    if (sisa === 0) {   
      // menambah saving ke tabel goals 
      await pool.query("UPDATE goals SET saving_goal = ?, finished = 1 WHERE id_goal = ?", [
        saving_goal,
        id_goal,
      ]);
    } else {
      // menambah saving ke tabel goals 
      await pool.query("UPDATE goals SET saving_goal = ? WHERE id_goal = ?", [
        saving_goal,
        id_goal,
      ]);
    }

    const balance = user.balance - amount;
    await pool.query("UPDATE users SET balance = ? WHERE id_user = ?", [
      balance,
      id_user,
    ]);
    
    const id_history = `h${nanoid(6)}y`;
    await pool.query("UPDATE users SET savings = ? WHERE id_user = ?", [
      savings,
      id_user,
    ]);
    
    const kategori = "savings";
    const label = "savings";
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_history, id_user ,kategori, amount, label) VALUES (?, ? ,? ,? ,?)",
      [id_history, id_user, kategori, amount, label]
    );

    const newUserData = await queryUsers(id_user);
    const savingsUser = newUserData.savings;
    const saving = {
      id_user: id_user,
      savings: savingsUser,
      id_goal: id_goal,
      goal: goal.goal,
      saving_goal: saving_goal,
      sisa_goal: sisa,
      kategori: kategori,
      amount: amount,
      label: label,
      created_at: new Date().toISOString(),
    };

    return saving;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addAllocations = async (id_user, kategori, amount) => {
  try {
    const user = await queryUsers(id_user);
    const id_alloc = `alo${nanoid(6)}`;
    const id_history = `h${nanoid(6)}y`;
    await pool.query(
      "INSERT INTO allocations (id_allocation, id_user, kategori, amount) VALUES(?, ?, ?, ?)",
      [id_alloc, id_user, kategori, amount]
    );
    const jmlAllocation = user.amount_allocation + amount;
    await pool.query(
      "UPDATE users SET amount_allocation = ? WHERE id_user = ?",
      [jmlAllocation, id_user]
    );
    // menambahkan data ke history
    const balance = user.balance - amount;
    await pool.query(
      "UPDATE users SET balance = ? WHERE id_user = ?",
      [balance, id_user]
    );
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_history, id_user ,kategori, amount, label) VALUES (?, ? ,? ,? ,?)",
      [id_history, id_user, "allocation", amount, kategori]
    );
    const newUserData = await queryUsers(id_user);
    const newJmlAllocation = newUserData.amount_allocation;
    const allocation = {
      id_allocation: id_alloc,
      id_user: id_user,
      kategori: kategori,
      amount: amount,
      amount_allocation: newJmlAllocation,
      created_at: new Date(),
    };

    return allocation;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateAllocation = async (id, amount, kategori, id_user) => {
  try {
    const user = await queryUsers(id_user);
    const amountUserBefore = user.amount_allocation;
    const [allocation] = await pool.query(
      "SELECT * FROM allocations WHERE id_allocation = ?",
      [id]
    );
    const amountAllocation = allocation[0].amount;

    if (amountAllocation < amount) {
      const currentAmount = amount - amountAllocation;
      const jmlAllocation = user.amount_allocation + currentAmount;
      const jmlBalance = user.balance - currentAmount;
      await pool.query(
        "UPDATE users SET amount_allocation = ? WHERE id_user = ?",
        [jmlAllocation, id_user]
      );
      await pool.query(
        "UPDATE users SET balance = ? WHERE id_user = ?",
        [jmlBalance, id_user]
      );
    } else {
      const currentAmount = amountAllocation - amount;
      const jmlAllocation = user.amount_allocation - currentAmount;
      const jmlBalance = user.balance + currentAmount;
      await pool.query(
        "UPDATE users SET amount_allocation = ? WHERE id_user = ?",
        [jmlAllocation, id_user]
      );
      await pool.query(
        "UPDATE users SET balance = ? WHERE id_user = ?",
        [jmlBalance, id_user]
      );
    }
    const id_history = `h${nanoid(6)}y`;
    await pool.query(
      "UPDATE allocations SET amount = ?, kategori = ? WHERE id_allocation = ?",
      [amount, kategori, id]
    );
    // menambahkan data ke history
    await pool.query(
      "INSERT INTO history (id_history, id_user ,kategori, amount, label) VALUES (?, ? ,? ,? ,?)",
      [id_history, id_user, "allocation", amount, kategori]
    );
    const newUser = await queryUsers(id_user);
    const amountUserAfter = newUser.amount_allocation;
    const updateResult = {
      id_allocation: id,
      id_user: id_user,
      jml_before_update: amountUserBefore,
      jml_after_update: amountUserAfter,
      amount: amount,
      kategori: kategori,
    };
    return updateResult;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteAllocation = async (id, id_user) => {
  try {
    const user = await queryUsers(id_user);
    const allocation = await queryAllocations(id);
    const amount_allocation = user.amount_allocation - allocation.amount;
    
    await pool.query(
      "UPDATE users SET amount_allocation = ? WHERE id_user = ?",
      [amount_allocation, id_user]
    );
    
    await pool.query(
      "DELETE FROM allocations WHERE id_allocation = ? AND id_user = ?",
      [id, id_user]
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

const addGoals = async (id_user, goal, amount, target, description) => {
  try {
    const id_gol = `gol${nanoid(6)}`;
    await pool.query(
      "INSERT INTO goals (id_goal, id_user, goal, amount, target, description) VALUES(? ,? ,? ,?, ?, ?)",
      [id_gol, id_user, goal, amount, target, description]
    );
    const dataGoal = {
      id_goal: id_gol,
      id_user: id_user,
      goal: goal,
      amount: amount,
      target: target,
      description: description,
      created_at: new Date().toISOString(),
    };
    return dataGoal;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteGoal = async (id, id_user) => {
  try {
    await pool.query("DELETE FROM goals WHERE id_goal = ? AND id_user = ?", [
      id,
      id_user,
    ]);
  } catch (err) {
    throw new Error(err.message);
  }
};

const getHistory = async (id_user) => {
  const [resultHistory] = await pool.query(
    "SELECT * FROM history WHERE id_user = ? ORDER BY updated_at DESC",
    [id_user]
  );
  return resultHistory;
};

const getGoal = async (id_user) => {
  const [resultGoal] = await pool.query(
    "SELECT * FROM goals WHERE id_user = ? ORDER BY created_at DESC",
    [id_user]
  );
  return resultGoal;
};

const getAllocation = async (id_user) => {
  const [resultAllocation] = await pool.query(
    "SELECT * FROM allocations WHERE id_user = ? ORDER BY created_at DESC",
    [id_user]
  );
  return resultAllocation;
};

const getHome = async (id_user) => {
  const user = await queryUsers(id_user);
  const [resultHistory] = await pool.query(
    "SELECT * FROM history WHERE id_user = ? ORDER BY updated_at DESC",
    [id_user]
  );
  const homeData = {
    id_user: id_user,
    nama: user.nama,
    balance: user.balance,
    savings: user.savings,
    amount_allocation: user.amount_allocation,
    resultHistory,
  };
  return homeData;
};

const updateGoal = async (id, goal, amount, target, description, id_user) => {
  try {
    await pool.query(
      "UPDATE goals SET goal = ?, amount = ?, target = ?, description = ? WHERE id_goal = ?",
      [goal, amount, target, description, id, id_user]
    );
    const updateResult = {
      id_goal: id,
      id_user: id_user,
      goal: goal,
      amount: amount,
      target: target,
      description: description,
    };
    return updateResult;
  } catch (err) {
    throw new Error(err.message);
  }
};

const queryGoals = async (id_goal) => {
  const [result] = await pool.query(
    "SELECT * FROM goals WHERE id_goal = ?",
    id_goal,
  );
  return result[0];
};

const queryAllocations = async (id_allocation) => {
  const [result] = await pool.query(
    "SELECT * FROM allocations WHERE id_allocation = ?",
    id_allocation,
  );
  return result[0];
};

const queryAllocationsByIdAndKategori = async (id_user, kategori) => {
  const [result] = await pool.query(
    "SELECT * FROM allocations WHERE id_user = ? AND kategori = ?",
    [id_user, kategori]
  );
  return result;
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
  queryGoals,
  queryAllocationsByIdAndKategori,
  addExpenses,
  getHistory,
  addSavings,
  addAllocations,
  updateAllocation,
  deleteAllocation,
  addGoals,
  updateGoal,
  deleteGoal,
  getGoal,
  getHome,
  getAllocation,
};
