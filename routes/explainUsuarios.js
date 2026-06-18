const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/explainUsuarios/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const result = await pool.query(`
      EXPLAIN (ANALYZE, BUFFERS)
      SELECT *
      FROM usuarios
      WHERE correo = $1
    `, [email]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;