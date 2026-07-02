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

router.put('/api/update_detalle_playlist', async (req, res) => {
    const { id_playlist, id_cancion, nueva_posicion } = req.body;

    if (!id_playlist || !id_cancion || !nueva_posicion) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Faltan campos obligatorios. Se requiere id_playlist, id_cancion y nueva_posicion.'
        });
    }

    if (typeof nueva_posicion !== 'number' || nueva_posicion <= 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'La posición debe ser un número mayor a 0.'
        });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

	 // check playlist exists
	const playlist = await client.query(`
	    SELECT id
	    FROM playlists
	    WHERE id = $1
	`, [id_playlist]);

	if (playlist.rows.length === 0) {
 	   await client.query('ROLLBACK');
 	   return res.status(404).json({
 	       ok: false,
 	       mensaje: `No se encontró una playlist con id ${id_playlist}.`
 	   });
	}

        // check cancion exists in playlist
        const actual = await client.query(`
            SELECT posicion
            FROM detalles_playlist
            WHERE id_playlist = $1
              AND id_cancion = $2
        `, [id_playlist, id_cancion]);

        if (actual.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontró la canción ${id_cancion} en la playlist ${id_playlist}.`
            });
        }

        const posicionActual = actual.rows[0].posicion;

        if (posicionActual === nueva_posicion) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                ok: false,
                mensaje: `La canción ya se encuentra en la posición ${nueva_posicion}.`
            });
        }

        // check target position exists
        const destino = await client.query(`
            SELECT id_cancion
            FROM detalles_playlist
            WHERE id_playlist = $1
              AND posicion = $2
        `, [id_playlist, nueva_posicion]);

        if (destino.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                ok: false,
                mensaje: `No existe ninguna canción en la posición ${nueva_posicion} de esta playlist.`
            });
        }

        const idCancionDestino = destino.rows[0].id_cancion;

        // swap directly — unique constraint is deferred to COMMIT
        await client.query(`
            UPDATE detalles_playlist
            SET posicion = $1
            WHERE id_playlist = $2
              AND id_cancion = $3
        `, [nueva_posicion, id_playlist, id_cancion]);

        await client.query(`
            UPDATE detalles_playlist
            SET posicion = $1
            WHERE id_playlist = $2
              AND id_cancion = $3
        `, [posicionActual, id_playlist, idCancionDestino]);

        await client.query('COMMIT'); // unique check happens here
        res.status(200).json({
            ok: true,
            mensaje: 'Posiciones intercambiadas con éxito',
            data: {
                id_playlist,
                id_cancion,
                posicion_anterior: posicionActual,
                posicion_nueva: nueva_posicion,
                id_cancion_desplazada: idCancionDestino,
                posicion_desplazada: posicionActual
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({
            ok: false,
            mensaje: 'Error al intercambiar posiciones',
            error: error.message,
            detalle: error.detail,
            codigo: error.code
        });
    } finally {
        client.release();
    }
});

module.exports = router;