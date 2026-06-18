const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/borrarHistoriales', async (req, res) => {
  try {
    const result = await pool.query(`
      DELETE FROM historiales
    `);

    res.json({
      mensaje: 'Registros de tabla historiales eliminados.',
      eliminados: result.rowCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;