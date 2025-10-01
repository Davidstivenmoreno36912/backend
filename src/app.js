// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mime = require('mime-types');
const productRouter = require('./routes/products'); // router unificado
const db = require('../db'); // pool con SSL

const app = express();
const PORT = process.env.PORT || 10000; // Render asigna puerto automáticamente

// ===============================
// CORS: permitir frontend GitHub Pages
// ===============================
app.use(cors({
  origin: 'https://davidstivenmoreno36912.github.io', // dominio principal
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ===============================
// Middleware
// ===============================
app.use(bodyParser.json());

// Archivos estáticos (uploads)
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, '../uploads', req.path);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===============================
// Rutas
// ===============================

// Usar router principal para productos
app.use('/api/products', productRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Servidor Express funcionando correctamente');
});

// ===============================
// Iniciar servidor
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
