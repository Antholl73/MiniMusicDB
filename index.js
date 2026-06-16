require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
});
const db = client.db('sistema_musica');
const logs = db.collection('logs');

async function guardarLog(tipo, mensaje, datos = {}) {
    const result = await logs.insertOne({
        tipo,
        mensaje,
        datos,
        fecha: new Date()
    });
    console.log(`[INSERT] ${tipo} - "${mensaje}" → id: ${result.insertedId}`);
}

async function insertar() {
    await guardarLog('INFO', 'Canción reproducida', {
        usuario_id: 42,
        cancion_id: 7,
        cancion: 'Bohemian Rhapsody',
        artista: 'Queen',
        duracion_segundos: 354
    });

    await guardarLog('ERROR', 'Error al cargar playlist', {
        usuario_id: 42,
        playlist_id: 15,
        error: 'Playlist not found',
        stack: 'Error: Playlist not found at...'
    });

    await guardarLog('INFO', 'Login exitoso', {
        usuario_id: 42,
        email: 'user@gmail.com',
        ip: '192.168.1.1',
        dispositivo: 'Chrome / Windows'
    });
}

async function leer() {
    const erroresHoy = await logs.find({
        tipo: 'ERROR',
        fecha: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }).toArray();
    console.log('\n[ERRORES HOY]', JSON.stringify(erroresHoy, null, 2));

    const logsUsuario = await logs.find({
        'datos.usuario_id': 42
    }).sort({ fecha: -1 }).limit(20).toArray();
    console.log('\n[LOGS USUARIO 42]', JSON.stringify(logsUsuario, null, 2));

    const reproducciones = await logs.countDocuments({
        mensaje: 'Canción reproducida',
        'datos.cancion_id': 7
    });
    console.log(`\n[REPRODUCCIONES] cancion_id 7 → ${reproducciones} vez/veces`);
}

async function main() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB\n');

        const modo = process.argv[2];

        if (modo === 'read') {
            await leer();
        } else if (modo === 'insert') {
            await insertar();
        } else {
            await insertar();
            await leer();
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main();
