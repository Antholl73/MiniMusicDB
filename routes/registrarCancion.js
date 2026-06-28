const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.post('/api/reproducciones/registrar', async (req, res) => {
  const { id_usuario, id_cancion, tiempo_actual } = req.body;

  // Validación de campos obligatorios
  if (id_usuario === undefined || id_cancion === undefined || tiempo_actual === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios. Se requiere id_usuario, id_cancion y tiempo_actual.'
    });
  }

  if (typeof tiempo_actual !== 'number' || tiempo_actual < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'tiempo_actual debe ser un número mayor o igual a 0.'
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // PASO 1: Insertar o actualizar la reproduccion del usuario.
    // ON CONFLICT actualiza si ya existe la combinacion (id_usuario, id_cancion).
    await client.query(`
      INSERT INTO reproducciones (id_usuario, id_cancion, estado, tiempo_actual)
      VALUES ($1, $2, TRUE, $3)
      ON CONFLICT (id_usuario, id_cancion)
      DO UPDATE SET
        estado        = TRUE,
        tiempo_actual = EXCLUDED.tiempo_actual
    `, [id_usuario, id_cancion, tiempo_actual]);

    // PASO 2: Insertar el registro en el historial con la fecha actual.
    // Se calcula el siguiente id correlativo para ese usuario.
    await client.query(`
      INSERT INTO historiales (id, id_usuario, id_cancion, fecha)
      VALUES (
        (SELECT COALESCE(MAX(id), 0) + 1 FROM historiales WHERE id_usuario = $1),
        $1,
        $2,
        CURRENT_DATE
      )
    `, [id_usuario, id_cancion]);

    // Los 2 pasos salieron bien: confirmar todo como una unidad atomica.
    await client.query('COMMIT');

    res.status(201).json({
      ok: true,
      mensaje: 'Reproducción registrada correctamente',
      data: {
        id_usuario,
        id_cancion,
        tiempo_actual,
        fecha: new Date().toISOString().split('T')[0]
      }
    });

  } catch (error) {
    // Si cualquier paso falla, revertir TODOS los cambios.
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar la reproducción. Se revirtieron todos los cambios.',
      error: error.message,
      codigo: error.code
    });

  } finally {
    // Siempre liberar la conexion al pool.
    client.release();
  }
});

module.exports = router;