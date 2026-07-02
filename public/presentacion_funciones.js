// FUNCIONES PARA LOS JSON FORMATEADOS
function cardExito(mensaje, data, query = null) {
    return `
        <div style="background:#f0fdf4; border:1px solid #22c55e; border-radius:8px; padding:10px; font-family:monospace; font-size:0.9em; display:inline-block; min-width:200px;">
            <div style="color:#16a34a; font-weight:bold; margin-bottom:4px;">✓ ${mensaje}</div>
            <div style="color:#333; line-height:1.3;">
                ${Object.entries(data).map(([key, val]) =>
                    `<div style="display:flex; gap:8px; margin:1px 0;">
                        <span style="color:#888; white-space:nowrap;">${key}:</span>
                        <span>${JSON.stringify(val)}</span>
                    </div>`
                ).join('')}
            </div>
            ${query ? `
            <div style="margin-top:6px; border-top:1px solid #bbf7d0; padding-top:4px;">
                <div style="color:#888; font-size:0.85em; margin-bottom:2px;">Query ejecutada:</div>
                <pre style="margin:0; padding:0; color:#555; white-space:pre-wrap; word-break:break-word;">${query}</pre>
            </div>` : ''}
        </div>
    `;
}

function cardError(datos, query = null) {
    return `
        <div style="background:#fef2f2; border:1px solid #ef4444; border-radius:8px; padding:10px; font-family:monospace; font-size:0.9em; color:#dc2626; display:inline-block; min-width:200px;">
            <div style="font-weight:bold; margin-bottom:4px;">✗ ${datos.mensaje}</div>
            <div style="color:#333; line-height:1.3;">
                ${Object.entries(datos)
                    .filter(([key]) => key !== 'ok' && key !== 'mensaje')
                    .map(([key, val]) =>
                        `<div style="display:flex; gap:8px; margin:1px 0;">
                            <span style="color:#888; white-space:nowrap;">${key}:</span>
                            <span>${JSON.stringify(val)}</span>
                        </div>`
                    ).join('')}
            </div>
            ${query ? `
            <div style="margin-top:6px; border-top:1px solid #fecaca; padding-top:4px;">
                <div style="color:#888; font-size:0.85em; margin-bottom:2px;">Query ejecutada:</div>
                <pre style="margin:0; padding:0; color:#555; white-space:pre-wrap; word-break:break-word;">${query}</pre>
            </div>` : ''}
        </div>
    `;
}

// FUNCION PARA LOS FORMULARIOS

function toggleForm(id) {
  const allForms = document.querySelectorAll('[id^="form"]');
  allForms.forEach(form => {
    if (form.id !== id) form.style.display = 'none'; // close others
  });

  const target = document.getElementById(id);
  target.style.display = target.style.display === 'none' ? 'block' : 'none';
}

// SECCION DE CREATE

async function insertarUsuario() {
    const correo = document.getElementById('insercion_usuario_correo').value;
    const nombre = document.getElementById('insercion_usuario_nombre').value;
    const pre = document.getElementById('resultado_insercion_usuario');
    const query =
	`INSERT INTO usuarios (correo, nombre)
	VALUES ($1, $2)
	RETURNING id`;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        pre.innerHTML = cardError({ mensaje: 'El correo no tiene un formato válido.' });
        return;
    }

    try {
        const respuesta = await fetch('/api/insertar_usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, nombre })
        });
        const datos = await respuesta.json();
        pre.innerHTML = datos.ok
            ? cardExito(datos.mensaje, datos.data, query)
            : cardError(datos, query);
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}

async function insertarDetalle_playlist() {
    const body = {
        id_playlist: Number(document.getElementById('insercion_detalle_ID_playlist').value),
        id_cancion: Number(document.getElementById('insercion_detalle_ID_cancion').value)
    };
    const pre = document.getElementById('resultado_insercion_detalle');
    const query =
	`INSERT INTO detalles_playlist (id_playlist, id_cancion, posicion)
	VALUES ($1, $2, $3)`;
    try {
        const respuesta = await fetch('/api/insertar_detalles_playlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const datos = await respuesta.json();
        pre.innerHTML = datos.ok
            ? cardExito(datos.mensaje, datos.data, query)
            : cardError(datos, query);
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}

// SECCION DE READ       
 
async function pestañaCancionesAlbum() {
    const id = document.getElementById('read_canciones_ID_album').value;
    if (!id) {
        alert('Ingresa un ID de álbum.');
        return;
    }
    window.open(`/api/read_canciones_album?id_album=${id}`, '_blank');
}

async function pestañaUsuariosCorreo() {
   window.open('/api/read_usuarios_correo', '_blank');
}

async function pestañaDetallesPlaylist() {
    const id = document.getElementById('read_detalles_ID_playlist').value;
    if (!id) {
        alert('Ingresa un ID de playlist.');
        return;
    }
    window.open(`/api/read_detalles_playlist?id_playlist=${id}`, '_blank');
}

// SECCION DE UPDATE

async function updateNombreGeneroCancion() {
    const id = document.getElementById('update_cancion_ID').value;
    const nombre = document.getElementById('update_cancion_nombre').value;
    const genero = Number(document.getElementById('update_cancion_genero').value);
    const pre = document.getElementById('resultado_update_cancion');

    const query =
`UPDATE canciones
SET nombre = $2, id_genero = $3
WHERE id = $1
RETURNING id, nombre, id_genero`;

    if (!id || !nombre || !genero) {
        pre.innerHTML = cardError({ mensaje: 'Todos los campos son obligatorios.' }, query);
        return;
    }

    try {
        const respuesta = await fetch('/api/update_cancion', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nombre, genero })
        });
        const datos = await respuesta.json();
        pre.innerHTML = datos.ok
            ? cardExito(datos.mensaje, datos.data, query)
            : cardError(datos, query);
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}

async function updateCorreoNombreUsuario() {
    const id = document.getElementById('update_ID_usuario').value;
    const correo = document.getElementById('update_usuario_correo').value;
    const nombre = document.getElementById('update_usuario_nombre').value;
    const pre = document.getElementById('resultado_update_usuario');

    const query =
`UPDATE usuarios
SET correo = $2, nombre = $3
WHERE id = $1
RETURNING id, correo, nombre`;

    if (!id || !correo || !nombre) {
        pre.innerHTML = cardError({ mensaje: 'Todos los campos son obligatorios.' }, query);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        pre.innerHTML = cardError({ mensaje: 'El correo no tiene un formato válido.' }, query);
        return;
    }

    try {
        const respuesta = await fetch('/api/update_usuario', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, correo, nombre })
        });
        const datos = await respuesta.json();
        pre.innerHTML = datos.ok
            ? cardExito(datos.mensaje, datos.data, query)
            : cardError(datos, query);
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}      

// SECCION DE DELETE      
  