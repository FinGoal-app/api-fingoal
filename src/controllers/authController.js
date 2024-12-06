// controllers/authController.js
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Fungsi registrasi manual
const register = async (req, res) => {
  const { nama, email, password } = req.body;

  try {
    // Periksa apakah email sudah ada
    let existingUser = await userModel.checkUserExists(email);

    if (existingUser.length > 0) {
      return res.json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tambahkan pengguna baru
    const userId = await userModel.addUser(nama, email, hashedPassword);

    const payload = {
      user: {
        id_user: userId,
      },
    };

    jwt.sign(payload, process.env.jwtUserSecret, {}, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        success: true,
        token: token,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: err.message
    });
  }
};

const userJwtConfig = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id_user);

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: err.message
    });
  }
};

// Fungsi login manual
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email belum terdaftar",
      });
    }

    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    const payload = {
      user: {
        id_user: user.id_user,
      },
    };

    jwt.sign(payload, process.env.jwtUserSecret, {}, (err, token) => {
      if (err) throw err;
      res.json({
        success: true,
        message: "Berhasil Login",
        user: {
          id_user: user.id_user,
          nama: user.nama,
          email: user.email,
          token: token
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Terjadi kesalahan pada server", 
      error: err.message 
    });
  }
};

module.exports = { register, login, userJwtConfig };
