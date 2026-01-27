const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/api', (req, res) => {
  res.send(`
    <h2>ReverseBuildApp - API en funcionamiento</h2>
    <p>Proyecto de Título - Ingeniería en Informática</p>
    <p>Backend operativo en Render</p>
  `);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
