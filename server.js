// Archivo: server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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
app.get('/api/canciones/genero/:id_genero/bien-calificadas', async (req, res) => {
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

    res.json({
      ok: true,
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      codigo: error.code
    });
  }
});

// Generos con sus reproducciones y duracion promedio de canciones
app.get('/api/generos/reproducciones', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.nombre                           AS nombre_genero,
        COUNT(r.id)                        AS total_reproducciones,
        ROUND(AVG(c.duracion)::numeric, 2) AS duracion_promedio_cancion
      FROM generos g
      INNER JOIN canciones c      ON g.id = c.id_genero
      INNER JOIN reproducciones r ON c.id = r.id_cancion
      GROUP BY
        g.id,
        g.nombre
      HAVING
        COUNT(r.id) >= 2
      ORDER BY
        total_reproducciones DESC
    `);

    res.json({
      ok: true,
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      codigo: error.code
    });
  }
});

// Añadir una canción con letra a un álbum
app.post('/api/canciones', async (req, res) => {
  const {
    id_album,
    id_artista,
    id_discografica,
    nombre_album,
    fecha_lanzamiento,
    id_genero,
    nombre,
    duracion,
    id_idioma,
    contenido
  } = req.body;

  // Validación de campos obligatorios para canción y letra
  if (
    id_album === undefined ||
    id_artista === undefined ||
    id_genero === undefined ||
    !nombre ||
    duracion === undefined ||
    id_idioma === undefined ||
    !contenido
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios en el body de la petición. Se requiere id_album, id_artista, id_genero, nombre, duracion, id_idioma y contenido.'
    });
  }

  if (typeof duracion !== 'number' || duracion <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'La duración debe ser un número mayor a 0.'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Opcionalmente insertar o asegurar el álbum si se envían los detalles completos del álbum
    if (nombre_album && fecha_lanzamiento) {
      await client.query(`
        INSERT INTO albumes (id, id_artista, id_discografica, nombre_album, fecha_lanzamiento)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id, id_artista) DO NOTHING
      `, [id_album, id_artista, id_discografica || null, nombre_album, fecha_lanzamiento]);
    }

    // 2. Insertar la canción
    const insertSongResult = await client.query(`
      INSERT INTO canciones (id_album, id_artista, id_genero, nombre, duracion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [id_album, id_artista, id_genero, nombre, duracion]);

    const newSongId = insertSongResult.rows[0].id;

    // 3. Insertar la letra de la canción
    await client.query(`
      INSERT INTO letras_cancion (id_cancion, id_idioma, contenido)
      VALUES ($1, $2, $3)
    `, [newSongId, id_idioma, contenido]);

    await client.query('COMMIT');

    res.status(201).json({
      ok: true,
      mensaje: 'Canción con letra añadida con éxito al álbum',
      data: {
        id_cancion: newSongId,
        id_album,
        id_artista,
        id_genero,
        nombre,
        duracion,
        letra: {
          id_idioma,
          contenido
        }
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      ok: false,
      mensaje: 'Error al añadir la canción con letra',
      error: error.message,
      codigo: error.code
    });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});