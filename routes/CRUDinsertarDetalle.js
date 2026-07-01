const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.post('/api/insertar_detalles_playlist', async (req, res) => {
  const { id_playlist, id_cancion } = req.body; // posicion removed

  if (id_playlist === undefined || id_cancion === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios. Se requiere id_playlist e id_cancion.'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // calculate next position for this playlist
    const maxResult = await client.query(`
      SELECT COALESCE(MAX(posicion), 0) AS max_pos
      FROM detalles_playlist
      WHERE id_playlist = $1
    `, [id_playlist]);

    const posicion = maxResult.rows[0].max_pos + 1;

    await client.query(`
      INSERT INTO detalles_playlist (id_playlist, id_cancion, posicion)
      VALUES ($1, $2, $3)
    `, [id_playlist, id_cancion, posicion]);

    await client.query('COMMIT');
    res.status(201).json({
      ok: true,
      mensaje: 'Detalle de playlist añadido con éxito',
      data: { id_playlist, id_cancion, posicion }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al añadir el detalle de playlist',
      error: error.message,
      detalle: error.detail,
      codigo: error.code
    });
  } finally {
    client.release();
  }
});

module.exports = router;