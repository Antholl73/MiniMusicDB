const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Añadir una canción con letra a un álbum
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

module.exports = router;