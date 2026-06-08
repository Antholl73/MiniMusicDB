// Archivo: src/app.js
const express = require('express');
require('dotenv').config();
const routes = require('./routes'); // Importamos los endpoints que creamos

const app = express();

// Para que nuestro servidor entienda el formato JSON
app.use(express.json());

// Usamos nuestras rutas con el prefijo /api
app.use('/api', routes);

// Encendemos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor MiniMusicDB corriendo en http://localhost:${PORT}`);
});