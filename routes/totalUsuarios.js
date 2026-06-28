const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

//total de usuarios
router.get('/api/reportes/total-usuarios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS total_usuarios
      FROM usuarios
    `);

    res.json({
      ok: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

module.exports = router;