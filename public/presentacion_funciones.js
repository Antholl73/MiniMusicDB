function toggleForm(id) {
  const allForms = document.querySelectorAll('[id^="form"]');
  allForms.forEach(form => {
    if (form.id !== id) form.style.display = 'none'; // close others
  });

  const target = document.getElementById(id);
  target.style.display = target.style.display === 'none' ? 'block' : 'none';
}

async function insertarUsuario() {
    const correo = document.getElementById('insercion_usuario_correo').value;
    const nombre = document.getElementById('insercion_usuario_nombre').value;

    // email validation — stops here if invalid, never reaches the fetch
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        document.getElementById('resultado_insercion_usuario').textContent =
            'Error: el correo no tiene un formato válido.';
        return;
    }

    const body = { correo, nombre };
    try {
        const respuesta = await fetch('/api/insertar_usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const datos = await respuesta.json();
        document.getElementById('resultado_insercion_usuario').textContent =
            JSON.stringify(datos, null, 2);
    } catch (error) {
        document.getElementById('resultado_insercion_usuario').textContent =
            `Error: ${error.message}`;
    }
}

async function insertarDetalle_playlist() {
    const body = {
        id_playlist: Number(document.getElementById('insercion_detalle_ID_playlist').value),
        id_cancion: Number(document.getElementById('insercion_detalle_ID_cancion').value)
    };
    try {
        const respuesta = await fetch('/api/insertar_detalles_playlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const datos = await respuesta.json();
        document.getElementById('resultado_insercion_detalle').textContent =
            JSON.stringify(datos, null, 2);
    } catch (error) {
        document.getElementById('resultado_insercion_detalle').textContent =
            `Error: ${error.message}`;
    }
}
        

  