const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Géneros de música en tendencia (últimos 30 días) basado en historiales
router.get('/api/generos/tendencia/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.id                              AS id_genero,
        g.nombre                          AS genero,
        COUNT(h.id)                       AS total_escuchas_recientes,
        COUNT(DISTINCT c.id)              AS canciones_distintas,
        COUNT(DISTINCT h.id_usuario)      AS oyentes_unicos,
        MIN(h.fecha)                      AS primera_escucha_periodo,
        MAX(h.fecha)                      AS ultima_escucha_periodo
      FROM historiales h
      INNER JOIN canciones c ON h.id_cancion = c.id
      INNER JOIN generos   g ON c.id_genero  = g.id
      WHERE
        h.fecha >= CURRENT_DATE - INTERVAL '30 days'
        AND h.fecha <= CURRENT_DATE
      GROUP BY
        g.id,
        g.nombre
      HAVING
        COUNT(h.id) >= 1
      ORDER BY
        total_escuchas_recientes DESC,
        oyentes_unicos           DESC
    `);

    // Construir CSV
    let csv = 'id_genero,genero,total_escuchas_recientes,canciones_distintas,oyentes_unicos,primera_escucha_periodo,ultima_escucha_periodo\n';

    result.rows.forEach(row => {
      csv += `${row.id_genero},${row.genero},${row.total_escuchas_recientes},${row.canciones_distintas},${row.oyentes_unicos},${row.primera_escucha_periodo},${row.ultima_escucha_periodo}\n`;
    });

    // Headers de descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_generos_tendencia.csv"'
    );

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      codigo: error.code
    });
  }
});

module.exports = router;
