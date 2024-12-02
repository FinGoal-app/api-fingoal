// models/userModel.js
const pool = require('../config/db'); // Koneksi database

// Fungsi untuk memeriksa apakah username atau email sudah terdaftar
const checkUserExists = async (username, email) => {
  const [results] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
  return results;
};

// Fungsi untuk menambahkan pengguna baru (manual)
const addUser = async (nama, username, email, hashedPassword) => {
  const [result] = await pool.query('INSERT INTO users (nama, username, email, password) VALUES (?, ?, ?, ?)', 
  [nama, username, email, hashedPassword]);
  return result.insertId;
};

// Fungsi untuk mengubah password
const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?',
  [hashedPassword, id]);
  return result;
}

// Fungsi untuk mencari pengguna berdasarkan email
const findUserByEmail = async (email) => {
  const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return results[0];
};

// Fungsi untuk mencari pengguna berdasarkan username
const findUserByUsername = async (username) => {
  const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return results[0];
};

module.exports = {
  checkUserExists,
  addUser,
  findUserByEmail,
  findUserByUsername,
  updatePassword,
};
