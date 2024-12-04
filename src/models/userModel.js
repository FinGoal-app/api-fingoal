// models/userModel.js
const pool = require('../config/db'); // Koneksi database

// Fungsi untuk memeriksa apakah sudah terdaftar
const checkUserExists = async (email) => {
  const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return results;
};

// Fungsi untuk menambahkan pengguna baru (manual)
const addUser = async (nama, email, hashedPassword) => {
  const [result] = await pool.query('INSERT INTO users (nama, email, password) VALUES (?, ?, ?)', 
  [nama, email, hashedPassword]);
  return result.insertId;
};

// Fungsi untuk mengubah password
const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query('UPDATE users SET password = ? WHERE id_users = ?',
    [hashedPassword, id]);
    return result;
  }

// Fungsi untuk mencari pengguna berdasarkan email
const findUserByEmail = async (email) => {
  const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return results[0];
};

module.exports = {
  checkUserExists,
  addUser,
  findUserByEmail,
  updatePassword,
};
