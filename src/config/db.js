const mysql = require('mysql2');

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: '34.101.38.70',
  user: 'db-instance',
  password: 'mypassword',
  database: 'fingoal',
  port: 3306,
});

// Koneksi MySQL menggunakan pool
const promisePool = pool.promise();

module.exports = promisePool;
