const mysql = require('mysql2');

// Konfigurasi koneksi database
const host = process.env.HOST;
const pool = mysql.createPool({
  host: host,
  user: 'fingoal',
  password: 'fingoal-app',
  database: 'fingoal_app',
  port: 3306,
});

// Koneksi MySQL menggunakan pool
const promisePool = pool.promise();

module.exports = promisePool;
