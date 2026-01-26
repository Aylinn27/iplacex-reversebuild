const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// --- CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS ---
// Como server.js está en /backend, usamos '..' para subir un nivel y encontrar /frontend
app.use(express.static(path.join(dirname, '..', 'frontend')));

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// --- RUTAS DE LA API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));

// --- RUTA PARA EL FRONTEND ---
// Maneja cualquier otra ruta devolviendo el index.html (necesario para SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(dirname, '..', 'frontend', 'index.html'));
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // Corregido: Uso de backticks ` para la interpolación de variables
  console.log(Servidor corriendo en puerto ${PORT}`);
});
