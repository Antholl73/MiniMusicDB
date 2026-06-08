// Archivo: src/routes.js
const { Router } = require('express');
const pool = require('./db');
const router = Router();

// 1. OPERACIONES CRUD COMPLEJAS (4.0 Puntos)
router.post('/albumes-completo', async (req, res) => {
    const { id_album, id_artista, id_discografica, nombre_album, fecha_lanzamiento, nombre_cancion, duracion, id_genero, id_idioma, contenido_letra } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Inicia transacción

        await client.query(
            `INSERT INTO albumes (id, id_artista, id_discografica, nombre_album, fecha_lanzamiento) VALUES ($1, $2, $3, $4, $5)`,
            [id_album, id_artista, id_discografica, nombre_album, fecha_lanzamiento]
        );

        const resultCancion = await client.query(
            `INSERT INTO canciones (id_album, id_artista, id_genero, nombre, duracion) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [id_album, id_artista, id_genero, nombre_cancion, duracion]
        );
        const nuevoIdCancion = resultCancion.rows[0].id;

        await client.query(
            `INSERT INTO letras_cancion (id_cancion, id_idioma, contenido) VALUES ($1, $2, $3)`,
            [nuevoIdCancion, id_idioma, contenido_letra]
        );

        await client.query('COMMIT'); // Guarda cambios
        res.status(201).json({ message: "Inserción en cascada exitosa", id_cancion: nuevoIdCancion });
    } catch (error) {
        await client.query('ROLLBACK'); // Deshace si hay error
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// 2. REPORTES Y EXPORTACIÓN CSV (2.0 Puntos)
router.get('/reportes/generos-populares', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT g.nombre AS nombre_genero, COUNT(r.id) AS total_reproducciones, ROUND(AVG(c.duracion)::numeric, 2) AS duracion_promedio_cancion
            FROM generos g
            INNER JOIN canciones c ON g.id = c.id_genero
            INNER JOIN reproducciones r ON c.id = r.id_cancion
            GROUP BY g.id, g.nombre
            HAVING COUNT(r.id) >= 2
            ORDER BY total_reproducciones DESC;
        `;
        const resultado = await pool.query(sqlQuery);

        let csvContent = "nombre_genero,total_reproducciones,duracion_promedio_cancion\n";
        resultado.rows.forEach(row => {
            csvContent += `"${row.nombre_genero}",${row.total_reproducciones},${row.duracion_promedio_cancion}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_generos.csv"');
        res.status(200).send(csvContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. MODELO HÍBRIDO NOSQL JSONB (2.5 Puntos)
router.put('/usuarios/:id/preferencias', async (req, res) => {
    try {
        const sqlQuery = `
            UPDATE usuarios 
            SET preferencias = preferencias || $1 
            WHERE id = $2 RETURNING id, nombre, preferencias;
        `;
        const resultado = await pool.query(sqlQuery, [JSON.stringify(req.body), req.params.id]);
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;