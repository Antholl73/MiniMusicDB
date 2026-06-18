const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/crearIndiceHistoriales', async (req, res) => {
  try {

    const existe = await pool.query(`
      SELECT 1
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'idx_historiales_usuario_fecha'
    `);

    if (existe.rowCount > 0) {
      return res.json({
        mensaje: 'El índice ya existe.'
      });
    }

    await pool.query(`
      CREATE INDEX idx_historiales_usuario_fecha
      ON historiales(id_usuario, fecha)
    `);

    res.json({
      mensaje: 'Índice creado correctamente.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;