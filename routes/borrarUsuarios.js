const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/borrarUsuarios', async (req, res) => {
  try {
    await pool.query(`
      TRUNCATE TABLE usuarios RESTART IDENTITY;
    `);

    res.json({ mensaje: 'Tabla vaciada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;