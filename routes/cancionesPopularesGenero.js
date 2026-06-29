const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Canciones de un genero con calificacion promedio >= 3
router.get('/api/canciones/genero/:id_genero/bien-calificadas/csv', async (req, res) => {
  const { id_genero } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        canciones.nombre AS nombre_cancion,
        AVG(calificaciones.valoracion) AS calificacion_promedio
      FROM canciones
      LEFT JOIN calificaciones ON canciones.id = calificaciones.id_cancion
      WHERE canciones.id_genero = $1
      GROUP BY canciones.nombre, canciones.id
      HAVING AVG(calificaciones.valoracion) >= 3
    `, [id_genero]);

    // construir CSV
    let csv = 'nombre_cancion,calificacion_promedio\n';

    result.rows.forEach(row => {
      csv += `${row.nombre_cancion},${row.calificacion_promedio}\n`;
    });

    //headers para descarga
    res.header('Content-Type', 'text/csv');
    res.attachment(`canciones_genero_${id_genero}.csv`);

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
