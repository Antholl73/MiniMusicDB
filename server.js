// Archivo: server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./dataBase');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'MiniMusicDB API corriendo' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS tiempo_actual');
    res.json({
      ok: true,
      mensaje: 'Conexion exitosa a la base de datos',
      tiempo_servidor: result.rows[0].tiempo_actual
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al conectar a la base de datos',
      error: error.message,
      codigo: error.code
    });
  }
});


const rutaTablas = require('./routes/tablas');
app.use('/api/total-tablas', rutaTablas);

app.use(require('./routes/generarUsuarios'));
app.use(require('./routes/explainUsuarios'));
app.use(require('./routes/borrarUsuarios'));

app.use(require('./routes/generarHistoriales'));
app.use(require('./routes/explainHistoriales'));
app.use(require('./routes/borrarHistoriales'));

app.use(require('./routes/crearIndiceHistoriales'));
app.use(require('./routes/borrarIndiceHistoriales'));

app.use(require('./routes/registrarCancion'));
app.use(require('./routes/cancionesporAlbum'));
app.use(require('./routes/crearPlaylist'));
app.use(require('./routes/cancionesporGenero'));
app.use(require('./routes/totalUsuarios'));
app.use(require('./routes/aniadircancionAlbum'));
app.use(require('./routes/generosReproducciones'));
app.use(require('./routes/cancionesPopularesGenero'));
app.use(require('./routes/generosTendencia'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
