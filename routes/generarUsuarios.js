const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/generarUsuarios/:cantidad', async (req, res) => {
  try {
    const cantidad = Number(req.params.cantidad);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        error: 'Cantidad inválida'
      });
    }

const result = await pool.query(`
  INSERT INTO usuarios (nombre, correo)
  SELECT
    'Usuario ' || (12+i),
    'usuario' || (12 + i) || '@test.com'
  FROM generate_series(1, $1) AS i
  ON CONFLICT (correo) DO NOTHING
`, [cantidad]);

    console.log(result.rowCount);

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