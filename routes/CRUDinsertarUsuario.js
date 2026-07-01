const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.post('/api/insertar_usuarios', async (req, res) => {
  const { correo, nombre } = req.body;

  if (!correo || !nombre) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios. Se requiere correo y nombre.'
    });
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El correo no tiene un formato válido.'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const resultado = await client.query(`
      INSERT INTO usuarios (correo, nombre)
      VALUES ($1, $2)
      RETURNING id
    `, [correo, nombre]);

    const nuevoId = resultado.rows[0].id;

    await client.query('COMMIT');
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario añadido con éxito',
      data: { id: nuevoId, correo, nombre }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al añadir el usuario',
      error: error.message,
      detalle: error.detail,
      codigo: error.code
    });
  } finally {
    client.release();
  }
});

module.exports = router;