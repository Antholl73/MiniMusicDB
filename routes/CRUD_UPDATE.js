const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

router.put('/api/update_cancion', async (req, res) => {
    const { id, nombre, genero } = req.body;

    if (!id || !nombre || !genero) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Faltan campos obligatorios. Se requiere id, nombre y genero.'
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const resultado = await client.query(`
            UPDATE canciones
            SET nombre = $2, id_genero = $3
            WHERE id = $1
            RETURNING id, nombre, id_genero
        `, [id, nombre, genero]);

        if (resultado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontró una canción con id ${id}.`
            });
        }

        await client.query('COMMIT');
        res.status(200).json({
            ok: true,
            mensaje: 'Canción actualizada con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar la canción',
            error: error.message,
            detalle: error.detail,
            codigo: error.code
        });
    } finally {
        client.release();
    }
});

router.put('/api/update_usuario', async (req, res) => {
    const { id, correo, nombre } = req.body;

    if (!id || !correo || !nombre) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Faltan campos obligatorios. Se requiere id, correo y nombre.'
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
            UPDATE usuarios
            SET correo = $2, nombre = $3
            WHERE id = $1
            RETURNING id, correo, nombre
        `, [id, correo, nombre]);

        if (resultado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontró un usuario con id ${id}.`
            });
        }

        await client.query('COMMIT');
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario actualizado con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar el usuario',
            error: error.message,
            detalle: error.detail,
            codigo: error.code
        });
    } finally {
        client.release();
    }
});

module.exports = router;