const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('API ReverseBuild funcionando correctamente');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
