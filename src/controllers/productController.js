const db = require('../models/product');

// Función para obtener todos los productos
exports.getAllProducts = (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los productos' });
      return;
    }
    res.status(200).json(result);
  });
};

// Función para crear un nuevo producto
exports.createProduct = (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.path : '';

  const sql = 'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, descripcion, precio, imagen], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el producto' });
      return;
    }
    res.status(201).json({ message: 'Producto creado exitosamente', id: result.insertId });
  });
};
