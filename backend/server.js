const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// 👉 Servir frontend estático
app.use(express.static(path.join(__dirname, '../frontend')));

// 👉 Ruta raíz → index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error(err));

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
