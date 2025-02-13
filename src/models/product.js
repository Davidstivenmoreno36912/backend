const mysql = require('mysql');

// Configurar conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',     // Nombre del host, usualmente 'localhost'
  port: 3306,            // Puerto de MySQL, 3306 por defecto
  user: 'root',          // Usuario de MySQL
  password: '1234',      // Contraseña de MySQL
  database: 'tienda online' // Nombre de la base de datos, sin espacios
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

module.exports = connection;
