const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error(err));

// 👉 Ruta raíz (ANTES de las demás rutas)
app.get("/", (req, res) => {
  res.send(`
    <h2>ReverseBuildApp - API en funcionamiento</h2>
    <p>Proyecto de Título - Ingeniería en Informática</p>
    <p>Backend operativo en Render</p>
  `);
});

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
