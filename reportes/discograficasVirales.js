const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Discográficas virales — más escuchadas en un período de fechas
// Query params: fecha_inicio, fecha_fin
router.get('/api/discograficas/virales/csv', async (req, res) => {
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
        d.id                              AS id_discografica,
        d.nombre                          AS discografica,
        COUNT(h.id)                       AS total_escuchas,
        COUNT(DISTINCT c.id)              AS canciones_distintas,
        COUNT(DISTINCT h.id_usuario)      AS oyentes_unicos,
        MIN(h.fecha)                      AS primera_escucha,
        MAX(h.fecha)                      AS ultima_escucha
      FROM historiales h
      INNER JOIN canciones     c ON h.id_cancion      = c.id
      INNER JOIN albumes       a ON c.id_album         = a.id
                                AND c.id_artista       = a.id_artista
      INNER JOIN discograficas d ON a.id_discografica  = d.id
      WHERE
        h.fecha >= $1
        AND h.fecha <= $2
      GROUP BY
        d.id,
        d.nombre
      HAVING
        COUNT(h.id) >= 1
      ORDER BY
        total_escuchas  DESC,
        oyentes_unicos  DESC
    `, [fecha_inicio, fecha_fin]);

    // Construir CSV
    let csv = 'id_discografica,discografica,total_escuchas,canciones_distintas,oyentes_unicos,primera_escucha,ultima_escucha\n';

    result.rows.forEach(row => {
      csv += `${row.id_discografica},${row.discografica},${row.total_escuchas},${row.canciones_distintas},${row.oyentes_unicos},${row.primera_escucha},${row.ultima_escucha}\n`;
    });

    // Headers de descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="discograficas_virales.csv"'
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
