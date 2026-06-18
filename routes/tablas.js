const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/', async (req, res) => {
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );

    if (tables.rows.length === 0) return res.send('<p>No hay tablas.</p>');

    let html = `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>DB Explorer</title>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
          h2   { margin-top: 40px; color: #333; border-bottom: 2px solid #666; padding-bottom: 6px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 10px; background: white; }
          th   { background: #333; color: white; padding: 8px 12px; text-align: left; }
          td   { padding: 8px 12px; border-bottom: 1px solid #ddd; }
          tr:hover td { background: #f0f0f0; }
          .count { font-size: 0.85em; color: #888; margin-bottom: 8px; }
        </style>
      </head>
      <body>
      <h1>📦 Base de datos</h1>
    `;

    for (const row of tables.rows) {
      const tabla = row.table_name;
      const data = await pool.query(`SELECT * FROM "${tabla}"`);
      const filas = data.rows;
      const columnas = filas.length > 0 ? Object.keys(filas[0]) : [];

      html += `<h2>📋 ${tabla}</h2>`;
      html += `<p class="count">${filas.length} filas</p>`;

      if (filas.length === 0) {
        html += '<p><em>Sin datos</em></p>';
        continue;
      }

      html += '<table>';
      html += '<tr>' + columnas.map(c => `<th>${c}</th>`).join('') + '</tr>';
      filas.forEach(fila => {
        html += '<tr>' + columnas.map(c => `<td>${fila[c] ?? ''}</td>`).join('') + '</tr>';
      });
      html += '</table>';
    }

    html += '</body></html>';
    res.send(html);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;