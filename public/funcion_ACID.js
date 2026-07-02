async function crearPlaylist() {
    const nombre = document.getElementById('nombrePlaylist').value;
    const canciones = document.getElementById('cancionesPlaylist').value
        .split(',')
        .map(id => Number(id.trim()));
    const pre = document.getElementById('resultadoPlaylist');

    const query =
`INSERT INTO playlists (tipo, nombre)
VALUES ('personalizada', $1)
RETURNING id

-- luego por cada cancion:
INSERT INTO detalles_playlist (id_playlist, id_cancion, posicion)
VALUES ($1, $2, $3)`;

    if (!nombre) {
        pre.innerHTML = cardError({ mensaje: 'El nombre de la playlist es obligatorio.' }, query);
        return;
    }

    if (canciones.some(id => isNaN(id) || id <= 0)) {
        pre.innerHTML = cardError({ mensaje: 'Los IDs de canciones deben ser números válidos separados por comas.' }, query);
        return;
    }

    try {
        const respuesta = await fetch('/api/playlists/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, canciones })
        });
        const datos = await respuesta.json();
        pre.innerHTML = datos.ok
            ? cardExito(datos.mensaje, { nombre, canciones: canciones.join(', '), total_canciones: canciones.length }, query)
            : cardError(datos, query);
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}