const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

app.post('/api/playlists/crear', async (req, res) => {
  const { nombre, canciones } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Crear playlist
    const playlist = await client.query(`
      INSERT INTO playlists (tipo, nombre)
      VALUES ('personalizada', $1)
      RETURNING id
    `, [nombre]);

    const id_playlist = playlist.rows[0].id;

    // Agregar canciones
    for (let i = 0; i < canciones.length; i++) {
      await client.query(`
        INSERT INTO detalles_playlist
        (id_playlist, id_cancion, posicion)
        VALUES ($1, $2, $3)
      `, [id_playlist, canciones[i], i + 1]);
    }

    await client.query('COMMIT');

    res.json({
      ok: true,
      mensaje: 'Playlist creada correctamente'
    });

  } catch (error) {
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      mensaje: 'No se pudo crear la playlist',
      error: error.message
    });

  } finally {
    client.release();
  }
});

module.exports = router;