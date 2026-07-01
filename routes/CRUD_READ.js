const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

const htmlShell = (title, query, bodyContent) => `
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
      h1   { color: #333; border-bottom: 2px solid #666; padding-bottom: 6px; }
      pre  { background: #222; color: #f8f8f8; padding: 16px; border-radius: 6px;
             font-size: 0.9em; white-space: pre-wrap; margin-bottom: 30px; }
      table { border-collapse: collapse; width: 100%; background: white; }
      th   { background: #333; color: white; padding: 8px 12px; text-align: left; }
      td   { padding: 8px 12px; border-bottom: 1px solid #ddd; }
      tr:hover td { background: #f0f0f0; }
      .count { font-size: 0.85em; color: #888; margin-bottom: 8px; }
      .label { font-weight: bold; color: #555; margin-bottom: 6px; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p class="label">Query ejecutada:</p>
    <pre>${query}</pre>
    ${bodyContent}
  </body>
  </html>
`;

const buildTable = (filas) => {
  if (filas.length === 0) return '<p><em>Sin resultados</em></p>';
  const columnas = Object.keys(filas[0]);
  let table = `<p class="count">${filas.length} filas</p><table>`;
  table += '<tr>' + columnas.map(c => `<th>${c}</th>`).join('') + '</tr>';
  filas.forEach(fila => {
    table += '<tr>' + columnas.map(c => `<td>${fila[c] ?? ''}</td>`).join('') + '</tr>';
  });
  table += '</table>';
  return table;
};

// ── Canciones dentro de un álbum ──────────────────────────────────────────────
router.get('/api/read_canciones_album', async (req, res) => {
  const { id_album } = req.query;
  if (!id_album) return res.status(400).send('<p>Falta id_album.</p>');

  const query =
`SELECT id, id_artista, id_genero, nombre, duracion
FROM canciones
WHERE id_album = ${id_album}
ORDER BY id`;

  try {
    const resultado = await pool.query(
      `SELECT id, id_artista, id_genero, nombre, duracion
       FROM canciones
       WHERE id_album = $1
       ORDER BY id`,
      [id_album]
    );
    res.send(htmlShell(
      `Canciones del álbum ${id_album}`,
      query,
      buildTable(resultado.rows)
    ));
  } catch (err) {
    res.status(500).send(`<p>Error: ${err.message}</p>`);
  }
});

// ── Usuarios con correo Gmail ─────────────────────────────────────────────────
router.get('/api/read_usuarios_correo', async (req, res) => {
  const query =
`SELECT id, correo, nombre
FROM usuarios
WHERE correo LIKE '%@gmail.com'
ORDER BY id`;

  try {
    const resultado = await pool.query(
      `SELECT id, correo, nombre
       FROM usuarios
       WHERE correo LIKE '%@gmail.com'
       ORDER BY id`
    );
    res.send(htmlShell(
      'Usuarios con correo Gmail',
      query,
      buildTable(resultado.rows)
    ));
  } catch (err) {
    res.status(500).send(`<p>Error: ${err.message}</p>`);
  }
});

// ── Canciones dentro de una playlist ─────────────────────────────────────────
router.get('/api/read_detalles_playlist', async (req, res) => {
  const { id_playlist } = req.query;
  if (!id_playlist) return res.status(400).send('<p>Falta id_playlist.</p>');

  const query =
`SELECT dp.id_cancion, c.nombre, dp.posicion
FROM detalles_playlist dp
JOIN canciones c ON c.id = dp.id_cancion
WHERE dp.id_playlist = ${id_playlist}
ORDER BY dp.posicion`;

  try {
    const resultado = await pool.query(
      `SELECT dp.id_cancion, c.nombre, dp.posicion
       FROM detalles_playlist dp
       JOIN canciones c ON c.id = dp.id_cancion
       WHERE dp.id_playlist = $1
       ORDER BY dp.posicion`,
      [id_playlist]
    );
    res.send(htmlShell(
      `Canciones de la playlist ${id_playlist}`,
      query,
      buildTable(resultado.rows)
    ));
  } catch (err) {
    res.status(500).send(`<p>Error: ${err.message}</p>`);
  }
});

module.exports = router;