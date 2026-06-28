const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Generos con sus reproducciones y duracion promedio de canciones
app.get('/api/generos/reproducciones/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.nombre AS nombre_genero,
        COUNT(r.id) AS total_reproducciones,
        ROUND(AVG(c.duracion)::numeric, 2) AS duracion_promedio_cancion
      FROM generos g
      INNER JOIN canciones c ON g.id = c.id_genero
      INNER JOIN reproducciones r ON c.id = r.id_cancion
      GROUP BY g.id, g.nombre
      HAVING COUNT(r.id) >= 2
      ORDER BY total_reproducciones DESC
    `);

    // construir CSV
    let csv = 'nombre_genero,total_reproducciones,duracion_promedio_cancion\n';

    result.rows.forEach(row => {
      csv += `${row.nombre_genero},${row.total_reproducciones},${row.duracion_promedio_cancion}\n`;
    });

    // headers de descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_generos_reproducciones.csv"'
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