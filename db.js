// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }, // obligatorio para Aiven
  connectTimeout: 10000, // 10 segundos
});

// Función para probar la conexión al iniciar
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a Aiven MySQL exitosa');
    connection.release();
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.code, err.message);
    setTimeout(testConnection, 5000); // Reintento cada 5 segundos
  }
}

testConnection();

module.exports = pool;

