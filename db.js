// db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: true } // 👈 obligatorio en Aiven
});

// Probar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err.code, err.message);
    return;
  }
  console.log('✅ Conexión a Aiven MySQL exitosa');
  connection.release();
});

module.exports = pool.promise();

