const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/generarHistoriales/:cantidad', async (req, res) => {
  try {
    const cantidad = Number(req.params.cantidad);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        error: 'Cantidad inválida'
      });
    }

    const result = await pool.query(`
      INSERT INTO historiales (
        id,
        id_usuario,
        id_cancion,
        fecha
      )
      SELECT
        i,
        floor(random() * 4 + 1)::int,
        floor(random() * 6 + 1)::int,
        CURRENT_TIMESTAMP - (random() * interval '10 years')
      FROM generate_series(1, $1) AS i
      ON CONFLICT DO NOTHING
    `, [cantidad]);

    res.json({
      insertados: result.rowCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;