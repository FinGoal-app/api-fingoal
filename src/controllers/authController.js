// controllers/authController.js
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');

// Fungsi registrasi manual
const register = async (req, res) => {
  const { nama, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Periksa apakah email sudah ada
    let existingUser = await userModel.checkUserExists(email);

    if (existingUser.length > 0) {
      return res.json({
        success: false,
        message: "Email already registered",
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
      message: 'Internal Server Error',
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
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// Fungsi login manual
const login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }

    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password",
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
        message: "Login Successful",
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
      message: "Internal Server Error", 
      error: err.message 
    });
  }
};

module.exports = { register, login, userJwtConfig };
