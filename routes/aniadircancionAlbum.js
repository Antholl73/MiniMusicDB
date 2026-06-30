const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Añadir una canción a un álbum
router.post('/api/canciones', async (req, res) => {
  const {
    id_album,
    id_artista,
    id_discografica,
    nombre_album,
    fecha_lanzamiento,
    id_genero,
    nombre,
    duracion,
    contenido
  } = req.body;

  // Validación de campos obligatorios
  if (
    id_album === undefined ||
    id_artista === undefined ||
    id_genero === undefined ||
    !nombre ||
    duracion === undefined ||
    !contenido
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios. Se requiere id_album, id_artista, id_genero, nombre, duracion y contenido.'
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

    // Crear álbum si se envían sus datos
    if (nombre_album && fecha_lanzamiento) {
      await client.query(`
        INSERT INTO albumes (
          id,
          id_artista,
          id_discografica,
          nombre_album,
          fecha_lanzamiento
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id, id_artista) DO NOTHING
      `, [
        id_album,
        id_artista,
        id_discografica || null,
        nombre_album,
        fecha_lanzamiento
      ]);
    }

    // Insertar canción con letras JSONB
    const insertSongResult = await client.query(`
      INSERT INTO canciones (
        id_album,
        id_artista,
        id_genero,
        nombre,
        duracion,
        letras
      )
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      RETURNING id
    `, [
      id_album,
      id_artista,
      id_genero,
      nombre,
      duracion,
      JSON.stringify({
        contenido: contenido
      })
    ]);

    const newSongId = insertSongResult.rows[0].id;

    await client.query('COMMIT');

    res.status(201).json({
      ok: true,
      mensaje: 'Canción añadida con éxito',
      data: {
        id_cancion: newSongId,
        id_album,
        id_artista,
        id_genero,
        nombre,
        duracion,
        letras: {
          contenido
        }
      }
    });

  } catch (error) {

    await client.query('ROLLBACK');

    console.error(error);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al añadir la canción',
      error: error.message,
      detalle: error.detail,
      codigo: error.code
    });

  } finally {
    client.release();
  }
});

module.exports = router;