// FUNCIONES PARA LOS REPORTES

// ─── Reporte 1: Artistas en Tendencia ──────────────────────────────────────
// GET /api/artistas/tendencia/csv?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
function descargarArtistaTendencia() {
    const fechaInicio = document.getElementById('reporte1_fecha_inicio').value;
    const fechaFin    = document.getElementById('reporte1_fecha_fin').value;

    if (!fechaInicio || !fechaFin) {
        showToast('warning', 'Campos incompletos:', 'Debes ingresar fecha de inicio y fecha de fin.');
        return;
    }
    if (fechaInicio > fechaFin) {
        showToast('warning', 'Fechas inválidas:', 'La fecha de inicio no puede ser mayor que la fecha de fin.');
        return;
    }

    window.location.href = `/api/artistas/tendencia/csv?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
}

// ─── Reporte 2: Canciones Populares por Género ─────────────────────────────
// GET /api/canciones/genero/:id_genero/bien-calificadas/csv
function descargarCancionesPopularesGenero() {
    const idGenero = document.getElementById('reporte2_id_genero').value;

    if (!idGenero) {
        showToast('warning', 'Campo incompleto:', 'Debes ingresar el ID del género.');
        return;
    }

    window.location.href = `/api/canciones/genero/${idGenero}/bien-calificadas/csv`;
}

// ─── Reporte 3: Canciones en Tendencia por Género ──────────────────────────
// GET /api/canciones/tendencia/genero/:id_genero/csv?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
function descargarCancionesTendenciaGenero() {
    const idGenero    = document.getElementById('reporte3_id_genero').value;
    const fechaInicio = document.getElementById('reporte3_fecha_inicio').value;
    const fechaFin    = document.getElementById('reporte3_fecha_fin').value;

    if (!idGenero || !fechaInicio || !fechaFin) {
        showToast('warning', 'Campos incompletos:', 'Debes ingresar el ID del género, la fecha de inicio y la fecha de fin.');
        return;
    }
    if (fechaInicio > fechaFin) {
        showToast('warning', 'Fechas inválidas:', 'La fecha de inicio no puede ser mayor que la fecha de fin.');
        return;
    }

    window.location.href = `/api/canciones/tendencia/genero/${idGenero}/csv?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
}

// ─── Reporte 4: Discográficas Virales ──────────────────────────────────────
// GET /api/discograficas/virales/csv?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
function descargarDiscograficasVirales() {
    const fechaInicio = document.getElementById('reporte4_fecha_inicio').value;
    const fechaFin    = document.getElementById('reporte4_fecha_fin').value;

    if (!fechaInicio || !fechaFin) {
        showToast('warning', 'Campos incompletos:', 'Debes ingresar fecha de inicio y fecha de fin.');
        return;
    }
    if (fechaInicio > fechaFin) {
        showToast('warning', 'Fechas inválidas:', 'La fecha de inicio no puede ser mayor que la fecha de fin.');
        return;
    }

    window.location.href = `/api/discograficas/virales/csv?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
}

// ─── Reporte 5: Géneros en Tendencia (últimos 30 días) ─────────────────────
// GET /api/generos/tendencia/csv  (sin parámetros)
function descargarGenerosTendencia() {
    window.location.href = '/api/generos/tendencia/csv';
}

// ─── Reporte 6: Hits de la Semana ──────────────────────────────────────────
// GET /api/canciones/hits/csv?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
function descargarHitsSemana() {
    const fechaInicio = document.getElementById('reporte6_fecha_inicio').value;
    const fechaFin    = document.getElementById('reporte6_fecha_fin').value;

    if (!fechaInicio || !fechaFin) {
        showToast('warning', 'Campos incompletos:', 'Debes ingresar fecha de inicio y fecha de fin.');
        return;
    }
    if (fechaInicio > fechaFin) {
        showToast('warning', 'Fechas inválidas:', 'La fecha de inicio no puede ser mayor que la fecha de fin.');
        return;
    }

    window.location.href = `/api/canciones/hits/csv?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
}
