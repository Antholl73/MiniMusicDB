const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/borrarIndiceHistoriales', async (req, res) => {
  try {
    const existe = await pool.query(`
      SELECT 1
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'idx_historiales_usuario_fecha'
    `);

    if (existe.rowCount === 0) {
      return res.status(404).json({
        error: 'El índice no existe.'
      });
    }

    await pool.query(`
      DROP INDEX idx_historiales_usuario_fecha
    `);

    res.json({
      mensaje: 'Índice eliminado correctamente.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;