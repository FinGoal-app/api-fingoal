const mysql = require('mysql2');

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.userDB,
  password: process.env.passwordDB,
  database: process.env.database,
  port: process.env.portDB,
});

// Koneksi MySQL menggunakan pool
const promisePool = pool.promise();

module.exports = promisePool;
