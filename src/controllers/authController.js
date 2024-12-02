// controllers/authController.js
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

// Fungsi registrasi manual
const register = async (req, res) => {
  const { password, nama, email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Periksa apakah email sudah ada
    const existingUser = await userModel.checkUserExists(email);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tambahkan pengguna baru
    const userId = await userModel.addUser(nama, email, hashedPassword, 'manual');

    res.status(201).json({
      message: 'Registrasi berhasil, silakan login',
      user: { id: userId, nama, email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

// Fungsi login manual
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ message: 'Login berhasil', user });
    } else {
      res.status(401).json({ message: 'email atau password salah' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

//  fungsi ganti password
const gantiPassword = async (req, res) => {
  const { passwordLama, passwordBaru, id } = req.body;
  // const { id } = req.user;
  try {
    const user = await userModel.findUserById(id);
    if (bcrypt.compareSync(passwordLama, user.password)) {
      const hashedPassword = bcrypt.hashSync(passwordBaru, 10);
      await userModel.updatePassword(id, hashedPassword);
      res.status(200).json({ message: "Password berhasil diganti" });
    } else {
      res.status(401).json({ message: "Password lama salah" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: err.message });
  }
};

module.exports = { register, login, gantiPassword };
