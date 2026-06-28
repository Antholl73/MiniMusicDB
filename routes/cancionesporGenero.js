const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

//total canciones por genero
router.get('/api/reportes/total-canciones-por-genero/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_genero, COUNT(*) AS total
      FROM canciones
      GROUP BY id_genero
    `);

    // crear
    let csv = 'id_genero,total_canciones\n';

    result.rows.forEach(row => {
      csv += `${row.id_genero},${row.total}\n`;
    });

    // descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="canciones_por_genero.csv"'
    );

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

module.exports = router;