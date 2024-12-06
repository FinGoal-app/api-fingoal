require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const moneyRoutes = require('./routes/moneyRoutes');

const app = express();

// Middleware untuk parsing JSON dan CORS
app.use(express.json());
app.use(cors());

// Menggunakan router
app.use('/', authRoutes);
app.use('/', moneyRoutes);
app.use('/auth', authRoutes);
app.use('/money', moneyRoutes);

// Test endpoint untuk koneksi database
app.get('/test', async (req, res) => {
  const db = require('./config/db');
  try {
    const [rows] = await db.query('SELECT NOW()');
    res.json({ message: 'Koneksi berhasil!', data: rows });
  } catch (error) {
    console.error('Error koneksi:', error);
    res.status(500).json({ message: 'Koneksi gagal', error: error.message });
  }
});

// Menjalankan server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di PORT : ${port}`);
});
