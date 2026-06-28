const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

//canctidad de canciones por album
router.get('/api/reportes/total-canciones-por-album/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_album, COUNT(*) AS total_canciones
      FROM canciones
      GROUP BY id_album
    `);

    let csv = 'id_album,total_canciones\n';

    result.rows.forEach(row => {
      csv += `${row.id_album},${row.total_canciones}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="canciones_por_album.csv"'
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