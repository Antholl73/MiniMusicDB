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

    await pool.query(`
      INSERT INTO usuarios (nombre, email, edad)
      SELECT
        'Usuario ' || i,
        'usuario' || i || '@test.com',
        (random() * 80)::int + 10
      FROM generate_series(1, $1) AS i
    `, [cantidad]);

    res.json({ mensaje: `${cantidad} usuarios creados` });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;


