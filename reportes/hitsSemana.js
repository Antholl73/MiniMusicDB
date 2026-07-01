const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Hits de la semana — canciones más escuchadas en un período de fechas
// Query params: fecha_inicio, fecha_fin
router.get('/api/canciones/hits/csv', async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({
      ok: false,
      error: 'Se requieren los parámetros fecha_inicio y fecha_fin (YYYY-MM-DD)'
    });
  }

  try {
    const result = await pool.query(`
      SELECT
        c.id                              AS id_cancion,
        c.nombre                          AS cancion,
        a.nombre                          AS artista,
        g.nombre                          AS genero,
        COUNT(h.id)                       AS total_escuchas,
        COUNT(DISTINCT h.id_usuario)      AS oyentes_unicos,
        MIN(h.fecha)                      AS primera_escucha,
        MAX(h.fecha)                      AS ultima_escucha
      FROM historiales h
      INNER JOIN canciones c ON h.id_cancion = c.id
      INNER JOIN artistas  a ON c.id_artista = a.id
      INNER JOIN generos   g ON c.id_genero  = g.id
      WHERE
        h.fecha >= $1
        AND h.fecha <= $2
      GROUP BY
        c.id,
        c.nombre,
        a.nombre,
        g.nombre
      HAVING
        COUNT(h.id) >= 1
      ORDER BY
        total_escuchas  DESC,
        oyentes_unicos  DESC
    `, [fecha_inicio, fecha_fin]);

    // Construir CSV
    let csv = 'id_cancion,cancion,artista,genero,total_escuchas,oyentes_unicos,primera_escucha,ultima_escucha\n';

    result.rows.forEach(row => {
      csv += `${row.id_cancion},${row.cancion},${row.artista},${row.genero},${row.total_escuchas},${row.oyentes_unicos},${row.primera_escucha},${row.ultima_escucha}\n`;
    });

    // Headers de descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="hits_semana.csv"'
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
