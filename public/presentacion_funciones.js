async function verTotalCanciones() {
    try {
        const respuesta = await fetch('/api/cantidad-canciones');
        const datos = await respuesta.json();

        document.getElementById('resultadoTotal').textContent =
            `Total de canciones: ${datos.total_canciones}`;
        } catch(error) {
        console.error(error);
        }
   }