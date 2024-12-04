const mysql = require('mysql2');

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: '34.128.125.71',
  user: 'fingoal',
  password: 'fingoal-app',
  database: 'fingoal_app',
  port: 3306,
});

// Koneksi MySQL menggunakan pool
const promisePool = pool.promise();

module.exports = promisePool;
