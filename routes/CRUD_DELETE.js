const express = require('express');
const router = express.Router();
const pool = require('../dataBase');


router.delete('/api/delete_cancion', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El ID de la canción es obligatorio.'
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const resultado = await client.query(`
            DELETE FROM canciones
            WHERE id = $1
            RETURNING id, nombre
        `, [id]);

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
            mensaje: 'Canción eliminada con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar la canción',
            error: error.message,
            detalle: error.detail,
            codigo: error.code
        });
    } finally {
        client.release();
    }
});

router.delete('/api/delete_usuario', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El ID del usuario es obligatorio.'
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const resultado = await client.query(`
            DELETE FROM usuarios
            WHERE id = $1
            RETURNING id, correo, nombre
        `, [id]);

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
            mensaje: 'Usuario eliminado con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar el usuario',
            error: error.message,
            detalle: error.detail,
            codigo: error.code
        });
    } finally {
        client.release();
    }
});

router.delete('/api/delete_detalle_playlist', async (req, res) => {
    const { id_playlist, id_cancion } = req.body;

    if (!id_playlist || !id_cancion) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Faltan campos obligatorios. Se requiere id_playlist e id_cancion.'
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const resultado = await client.query(`
            DELETE FROM detalles_playlist
            WHERE id_playlist = $1
              AND id_cancion = $2
            RETURNING id_playlist, id_cancion, posicion
        `, [id_playlist, id_cancion]);

        if (resultado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontró el detalle con playlist ${id_playlist} y canción ${id_cancion}.`
            });
        }

        await client.query('COMMIT');
        res.status(200).json({
            ok: true,
            mensaje: 'Detalle de playlist eliminado con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar el detalle de playlist',
            error: error.message,
            detalle: error.detail,
            codigo: error.code
        });
    } finally {
        client.release();
    }
});

module.exports = router;