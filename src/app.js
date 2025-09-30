// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mime = require('mime-types');
const productRouter = require('./routes/products');
const db = require('../db'); // pool con SSL

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS para permitir peticiones desde tu frontend
app.use(cors({
  origin: 'https://davidstivenmoreno36912.github.io', // <-- reemplaza con tu URL de frontend
}));

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para archivos uploads
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, '../uploads', req.path);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de productos desde router
app.use('/api/products', productRouter);

// Endpoint para todos los productos
app.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Endpoint para producto por ID
app.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error al obtener el producto:', err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Servidor Express funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
