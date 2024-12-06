const pool = require("../config/db"); // Koneksi database
// koneksi ke nanoid
const { nanoid } = require('nanoid');

// Fungsi untuk memeriksa apakah sudah terdaftar
const checkUserExists = async (email) => {
  const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return results;
};

// Fungsi untuk menambahkan pengguna baru (manual)
const addUser = async (nama, email, hashedPassword) => {
  const id_user = `usr_${nanoid(8)}`;
  const [result] = await pool.query(
    "INSERT INTO users (id_user, nama, email, password) VALUES (?, ?, ?, ?)",[
      id_user, 
      nama, 
      email, 
      hashedPassword
    ]);
  return result.insertId;
};

// Fungsi untuk mencari pengguna berdasarkan id tanpa password
const getUserById = async (id_user) => {
  const [results] = await pool.query("SELECT * FROM users WHERE id_user = ?", [
    id_user,
  ]);
  return results;
};

// Fungsi untuk mencari pengguna berdasarkan email
const findUserByEmail = async (email) => {
  const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return results[0];
};

module.exports = {
  checkUserExists,
  addUser,
  findUserByEmail,
  getUserById
};
