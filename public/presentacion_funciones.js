// FUNCIONES PARA LOS JSON FORMATEADOS
function cardExito(mensaje, data, query = null) {
    return `
        <div style="background:#f0fdf4; border:1px solid #22c55e; border-radius:8px; padding:16px; font-family:monospace; font-size:0.9em;">
            <div style="color:#16a34a; font-weight:bold; margin-bottom:10px;">
                ✓ ${mensaje}
            </div>
            <div style="color:#333;">
                ${Object.entries(data).map(([key, val]) =>
                    `<div style="margin:4px 0;">
                        <span style="color:#888;">${key}:</span>
                        <span style="margin-left:8px;">${JSON.stringify(val)}</span>
                    </div>`
                ).join('')}
            </div>
            ${query ? `
            <div style="margin-top:12px; border-top:1px solid #bbf7d0; padding-top:10px;">
                <div style="color:#888; font-size:0.85em; margin-bottom:4px;">Query ejecutada:</div>
                <pre style="margin:0; color:#555; white-space:pre-wrap;">${query}</pre>
            </div>` : ''}
        </div>
    `;
}

function cardError(datos, query = null) {
    return `
        <div style="background:#fef2f2; border:1px solid #ef4444; border-radius:8px; padding:16px; font-family:monospace; font-size:0.9em; color:#dc2626;">
            <div style="font-weight:bold; margin-bottom:10px;">✗ ${datos.mensaje}</div>
            <div style="color:#333;">
                ${Object.entries(datos)
                    .filter(([key]) => key !== 'ok' && key !== 'mensaje')
                    .map(([key, val]) =>
                        `<div style="margin:4px 0;">
                            <span style="color:#888;">${key}:</span>
                            <span style="margin-left:8px;">${JSON.stringify(val)}</span>
                        </div>`
                    ).join('')}
            </div>
            ${query ? `
            <div style="margin-top:12px; border-top:1px solid #fecaca; padding-top:10px;">
                <div style="color:#888; font-size:0.85em; margin-bottom:4px;">Query ejecutada:</div>
                <pre style="margin:0; color:#555; white-space:pre-wrap;">${query}</pre>
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
        pre.innerHTML = cardError('El correo no tiene un formato válido.');
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
  