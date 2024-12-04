const pool = require("../config/db");

const addIncome = async (id_user, amount, tujuan) => {
  const user = await queryUsers(id_user);
  const balance = user.balance + amount;
  try {
    const [resultIncomes] = await pool.query(
      "INSERT INTO incomes (id_user, amount, tujuan) VALUES (?, ? ,?)",
      [id_user, amount, tujuan]
    );
    await pool.query("UPDATE users SET balance = ? WHERE id_user = ?", [
      balance,
      id_user,
    ]);
    const id_expanse = resultIncomes.insertId;
    const hystory = {
      id_incomes: id_expanse,
      id_user: id_user,
      balance: balance,
      amount: amount,
      tujuan: tujuan,
    };
    return hystory;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada Query SQL', error: err.message });
  }
};

const queryUsers = async (id_user) => {
  const [results] = await pool.query("SELECT * FROM users WHERE id_user = ?", [
    id_user,
  ]);
  return results[0];
};

module.exports = {
  addIncome,
  queryUsers,
};
