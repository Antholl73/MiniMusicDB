// Archivo: server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./dataBase');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'MiniMusicDB API corriendo' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS tiempo_actual');
    res.json({
      ok: true,
      mensaje: 'Conexion exitosa a la base de datos',
      tiempo_servidor: result.rows[0].tiempo_actual
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al conectar a la base de datos',
      error: error.message,
      codigo: error.code
    });
  }
});

// Canciones del genero 3 con calificacion promedio >= 3
app.get('/api/canciones/genero/:id_genero/bien-calificadas/csv', async (req, res) => {
  const { id_genero } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        canciones.nombre AS nombre_cancion,
        AVG(calificaciones.valoracion) AS calificacion_promedio
      FROM canciones
      LEFT JOIN calificaciones ON canciones.id = calificaciones.id_cancion
      WHERE canciones.id_genero = $1
      GROUP BY canciones.nombre, canciones.id
      HAVING AVG(calificaciones.valoracion) >= 3
    `, [id_genero]);

    // construir CSV
    let csv = 'nombre_cancion,calificacion_promedio\n';

    result.rows.forEach(row => {
      csv += `${row.nombre_cancion},${row.calificacion_promedio}\n`;
    });

    //headers para descarga
    res.header('Content-Type', 'text/csv');
    res.attachment(`canciones_genero_${id_genero}.csv`);

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      codigo: error.code
    });
  }
});

// Generos con sus reproducciones y duracion promedio de canciones
app.get('/api/generos/reproducciones/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.nombre AS nombre_genero,
        COUNT(r.id) AS total_reproducciones,
        ROUND(AVG(c.duracion)::numeric, 2) AS duracion_promedio_cancion
      FROM generos g
      INNER JOIN canciones c ON g.id = c.id_genero
      INNER JOIN reproducciones r ON c.id = r.id_cancion
      GROUP BY g.id, g.nombre
      HAVING COUNT(r.id) >= 2
      ORDER BY total_reproducciones DESC
    `);

    // construir CSV
    let csv = 'nombre_genero,total_reproducciones,duracion_promedio_cancion\n';

    result.rows.forEach(row => {
      csv += `${row.nombre_genero},${row.total_reproducciones},${row.duracion_promedio_cancion}\n`;
    });

    // headers de descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reporte_generos_reproducciones.csv"'
    );

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      codigo: error.code
    });
  }
});

// Añadir una canción con letra a un álbum
app.post('/api/canciones', async (req, res) => {
  const {
    id_album,
    id_artista,
    id_discografica,
    nombre_album,
    fecha_lanzamiento,
    id_genero,
    nombre,
    duracion,
    id_idioma,
    contenido
  } = req.body;

  

  // Validación de campos obligatorios para canción y letra
  if (
    id_album === undefined ||
    id_artista === undefined ||
    id_genero === undefined ||
    !nombre ||
    duracion === undefined ||
    id_idioma === undefined ||
    !contenido
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios en el body de la petición. Se requiere id_album, id_artista, id_genero, nombre, duracion, id_idioma y contenido.'
    });
  }

  if (typeof duracion !== 'number' || duracion <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'La duración debe ser un número mayor a 0.'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Opcionalmente insertar o asegurar el álbum si se envían los detalles completos del álbum
    if (nombre_album && fecha_lanzamiento) {
      await client.query(`
        INSERT INTO albumes (id, id_artista, id_discografica, nombre_album, fecha_lanzamiento)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id, id_artista) DO NOTHING
      `, [id_album, id_artista, id_discografica || null, nombre_album, fecha_lanzamiento]);
    }

    // 2. Insertar la canción
    const insertSongResult = await client.query(`
      INSERT INTO canciones (id_album, id_artista, id_genero, nombre, duracion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [id_album, id_artista, id_genero, nombre, duracion]);

    const newSongId = insertSongResult.rows[0].id;

    // 3. Insertar la letra de la canción
    await client.query(`
      INSERT INTO letras_cancion (id_cancion, id_idioma, contenido)
      VALUES ($1, $2, $3)
    `, [newSongId, id_idioma, contenido]);

    await client.query('COMMIT');

    res.status(201).json({
      ok: true,
      mensaje: 'Canción con letra añadida con éxito al álbum',
      data: {
        id_cancion: newSongId,
        id_album,
        id_artista,
        id_genero,
        nombre,
        duracion,
        letra: {
          id_idioma,
          contenido
        }
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      ok: false,
      mensaje: 'Error al añadir la canción con letra',
      error: error.message,
      codigo: error.code
    });
  } finally {
    client.release();
  }
});


// Total de canciones
app.get('/api/cantidad-canciones', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT COUNT(*) AS total_canciones
            FROM canciones
        `);

        res.json({
            ok: true,
            total_canciones: result.rows[0].total_canciones
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
    
});
//total de usuarios
app.get('/api/reportes/total-usuarios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS total_usuarios
      FROM usuarios
    `);

    res.json({
      ok: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

//total canciones por genero
app.get('/api/reportes/total-canciones-por-genero/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_genero, COUNT(*) AS total
      FROM canciones
      GROUP BY id_genero
    `);

    // crear
    let csv = 'id_genero,total_canciones\n';

    result.rows.forEach(row => {
      csv += `${row.id_genero},${row.total}\n`;
    });

    // descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="canciones_por_genero.csv"'
    );

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

//canctidad de canciones por album
app.get('/api/reportes/total-canciones-por-album/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_album, COUNT(*) AS total_canciones
      FROM canciones
      GROUP BY id_album
    `);

    let csv = 'id_album,total_canciones\n';

    result.rows.forEach(row => {
      csv += `${row.id_album},${row.total_canciones}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="canciones_por_album.csv"'
    );

    res.send(csv);

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.post('/api/playlists/crear', async (req, res) => {
  const { nombre, canciones } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Crear playlist
    const playlist = await client.query(`
      INSERT INTO playlists (tipo, nombre)
      VALUES ('personalizada', $1)
      RETURNING id
    `, [nombre]);

    const id_playlist = playlist.rows[0].id;

    // Agregar canciones
    for (let i = 0; i < canciones.length; i++) {
      await client.query(`
        INSERT INTO detalles_playlist
        (id_playlist, id_cancion, posicion)
        VALUES ($1, $2, $3)
      `, [id_playlist, canciones[i], i + 1]);
    }

    await client.query('COMMIT');

    res.json({
      ok: true,
      mensaje: 'Playlist creada correctamente'
    });

  } catch (error) {
    await client.query('ROLLBACK');

    res.status(500).json({
      ok: false,
      mensaje: 'No se pudo crear la playlist',
      error: error.message
    });

  } finally {
    client.release();
  }
});

app.post('/api/reproducciones/registrar', async (req, res) => {
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

    // PASO 3: Insertar calificacion inicial (0 estrellas) solo si el usuario
    // aun no ha calificado esta cancion. Si ya existe, no se hace nada.
    await client.query(`
      INSERT INTO calificaciones (id_usuario, id_cancion, valoracion)
      VALUES ($1, $2, 0)
      ON CONFLICT (id_usuario, id_cancion) DO NOTHING
    `, [id_usuario, id_cancion]);

    // Los 3 pasos salieron bien: confirmar todo como una unidad atomica.
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

const rutaTablas = require('./routes/tablas');
app.use('/api/total-tablas', rutaTablas);

app.use(require('./routes/generarUsuarios'));
app.use(require('./routes/explainUsuarios'));
app.use(require('./routes/borrarUsuarios'));

app.use(require('./routes/generarHistoriales'));
app.use(require('./routes/explainHistoriales'));
app.use(require('./routes/borrarHistoriales'));

app.use(require('./routes/crearIndiceHistoriales'));
app.use(require('./routes/borrarIndiceHistoriales'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
