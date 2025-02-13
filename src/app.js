const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const mime = require('mime-types'); // Para resolver el problema de Content-Type
const productRouter = require('./routes/products'); // Verifica esta ruta

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'tienda_online' // Verifica el nombre de la base de datos
});

// Conexión a la base de datos MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        throw err;
    }
    console.log('Conexión a MySQL exitosa');
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Habilita CORS para todas las rutas

// Middleware para establecer el tipo MIME correcto para los archivos estáticos
app.use('/uploads', (req, res, next) => {
    const filePath = path.join(__dirname, '../uploads', req.path);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    next();
});

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Asegúrate de que esta ruta sea correcta

// Rutas
app.use('/api/products', productRouter); // Cambia la ruta si es necesario

// Endpoint para obtener todos los productos
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM productos'; // Asegúrate de que el nombre de la tabla sea correcto
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(result);
    });
});

// Endpoint para obtener un producto por ID
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM productos WHERE id = ?'; // Usa '?' para prevenir SQL Injection
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json(result[0]);
    });
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('El servidor Express está funcionando correctamente');
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor está corriendo en http://localhost:${port}`);
});
