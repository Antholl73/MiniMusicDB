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

// Canciones del genero 3 con calificacion promedio >= 3
app.get('/api/canciones/genero/:id_genero/bien-calificadas/csv', async (req, res) => {
  const { id_genero } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        canciones.nombre AS nombre_cancion,
        AVG(calificaciones.valoracion) AS calificacion_promedio
      FROM canciones
      LEFT JOIN calificaciones ON canciones.id = calificaciones.id_cancion
      WHERE canciones.id_genero = $1
      GROUP BY canciones.nombre, canciones.id
      HAVING AVG(calificaciones.valoracion) >= 3
    `, [id_genero]);

    // construir CSV
    let csv = 'nombre_cancion,calificacion_promedio\n';

    result.rows.forEach(row => {
      csv += `${row.nombre_cancion},${row.calificacion_promedio}\n`;
    });

    //headers para descarga
    res.header('Content-Type', 'text/csv');
    res.attachment(`canciones_genero_${id_genero}.csv`);

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      codigo: error.code
    });
  }
});

// Generos con sus reproducciones y duracion promedio de canciones
app.get('/api/generos/reproducciones/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.nombre AS nombre_genero,
        COUNT(r.id) AS total_reproducciones,
        ROUND(AVG(c.duracion)::numeric, 2) AS duracion_promedio_cancion
      FROM generos g
      INNER JOIN canciones c ON g.id = c.id_genero
      INNER JOIN reproducciones r ON c.id = r.id_cancion
      GROUP BY g.id, g.nombre
      HAVING COUNT(r.id) >= 2
      ORDER BY total_reproducciones DESC
    `);

    // construir CSV
    let csv = 'nombre_genero,total_reproducciones,duracion_promedio_cancion\n';

    result.rows.forEach(row => {
      csv += `${row.nombre_genero},${row.total_reproducciones},${row.duracion_promedio_cancion}\n`;
    });

    // headers de descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_generos_reproducciones.csv"'
    );

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
