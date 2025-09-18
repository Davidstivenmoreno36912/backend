// product.js
const db = require('../../db'); // importa el pool de db.js

// Ejemplo: obtener todos los productos
async function getProducts() {
  try {
    const [rows] = await db.query('SELECT * FROM productos'); // ajusta el nombre de tu tabla
    return rows;
  } catch (err) {
    console.error('Error al obtener productos:', err);
    throw err;
  }
}

module.exports = { getProducts };
