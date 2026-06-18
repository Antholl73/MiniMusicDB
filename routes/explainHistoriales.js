const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/explainHistoriales/:idUsuario', async (req, res) => {
  try {
    const idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      return res.status(400).json({
        error: 'ID de usuario inválido'
      });
    }

    const result = await pool.query(`
      EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
      SELECT *
      FROM historiales
      WHERE id_usuario = $1
        AND fecha >= '2021-01-01'
        AND fecha < '2027-01-01'
    `, [idUsuario]);

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;