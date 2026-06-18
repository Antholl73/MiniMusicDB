const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.get('/api/borrarUsuarios', async (req, res) => {
  try {
    await pool.query(`
      DELETE FROM usuarios
      WHERE id > 12
    `);

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('usuarios', 'id'),
        12,
        true
      )
    `);

    res.json({
      mensaje: 'Usuarios de prueba eliminados'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;