const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2'); // 👈 mejor usar mysql2 (más moderno)
const mime = require('mime-types');
const productRouter = require('./routes/products'); // Verifica esta ruta

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos MySQL (Render o PlanetScale)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '1234',
    database: process.env.DB_NAME || 'tienda_online'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a MySQL:', err);
        return;
    }
    console.log('✅ Conexión a MySQL exitosa');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Middleware para establecer tipo MIME en uploads
app.use('/uploads', (req, res, next) => {
    const filePath = path.join(__dirname, '../uploads', req.path);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    next();
});

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/products', productRouter);

// Endpoint para obtener todos los productos
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('❌ Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(result);
    });
});

// Endpoint para obtener producto por ID
app.get('/products/:id', (req, res) => {
    const sql = 'SELECT * FROM productos WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('❌ Error al obtener el producto:', err);
            return res.status(500).json({ error: 'Error al obtener el producto' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result[0]);
    });
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('🚀 El servidor Express está funcionando correctamente');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
