const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/', async (req, res) => {  
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );

    if (tables.rows.length === 0) {
      return res.json([]);
    }

    const unionQuery = tables.rows
      .map(r =>
        `SELECT '${r.table_name}' AS table,
                row_to_json(t) AS data
         FROM "${r.table_name}" t`
      )
      .join(' UNION ALL ');

    const result = await pool.query(unionQuery);

    res.json(result.rows);  

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

module.exports = router;