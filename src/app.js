// app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware untuk parsing JSON dan CORS
app.use(express.json());
app.use(cors());

// Menggunakan router
app.use('/auth', authRoutes);

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
const port = 8080;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
