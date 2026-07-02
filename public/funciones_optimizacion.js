async function generarHistoriales() {
    const pre = document.getElementById('resultadoGeneracionHistoriales');
    const query =
`INSERT INTO historiales (id, id_usuario, id_cancion, fecha)
SELECT i, floor(random() * 4 + 1)::int, floor(random() * 6 + 1)::int,
       CURRENT_TIMESTAMP - (random() * interval '10 years')
FROM generate_series(1, 1000) AS i
ON CONFLICT DO NOTHING`;

    try {
        const respuesta = await fetch('/api/generarHistoriales/1000');
        const datos = await respuesta.json();
        if (datos.error) {
            pre.innerHTML = cardError({ mensaje: datos.error }, query);
        } else {
            pre.innerHTML = cardExito('Historiales generados', { insertados: datos.insertados }, query);
        }
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}

async function borrarHistoriales() {
    const pre = document.getElementById('resultadoBorradoHistoriales');
    const query =
`DELETE FROM historiales`;

    try {
        const respuesta = await fetch('/api/borrarHistoriales');
        const datos = await respuesta.json();
        if (datos.error) {
            pre.innerHTML = cardError({ mensaje: datos.error }, query);
        } else {
            pre.innerHTML = cardExito(datos.mensaje, { eliminados: datos.eliminados }, query);
        }
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}

async function explainHistoriales() {
    const pre = document.getElementById('resultadoExplainHistoriales');
const query =
`EXPLAIN ANALYZE
SELECT *
FROM historiales
WHERE id_usuario = 3
  AND fecha >= '2021-01-01'
  AND fecha < '2027-01-01'`;

    try {
        const respuesta = await fetch('/api/explainHistoriales/3');
        const datos = await respuesta.json();
        if (datos.error) {
            pre.innerHTML = cardError({ mensaje: datos.error }, query);
        } else {
            // explain returns an array of plan rows, display as plain text
            pre.innerHTML = cardExito(
                'EXPLAIN ANALYZE ejecutado',
                { plan: datos.map(fila => fila["QUERY PLAN"]).join('\n') },
                query
            );
        }
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}

async function crearIndiceHistoriales() {
    const pre = document.getElementById('resultadoCrearIndiceHistoriales');
    const query =
`CREATE INDEX idx_historiales_usuario_fecha
ON historiales(id_usuario, fecha)`;

    try {
        const respuesta = await fetch('/api/crearIndiceHistoriales');
        const datos = await respuesta.json();
        if (datos.error) {
            pre.innerHTML = cardError({ mensaje: datos.error }, query);
        } else {
            pre.innerHTML = cardExito(datos.mensaje, { indice: 'idx_historiales_usuario_fecha' }, query);
        }
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}

async function borrarIndiceHistoriales() {
    const pre = document.getElementById('resultadoBorrarIndiceHistoriales');
    const query =
`DROP INDEX idx_historiales_usuario_fecha`;

    try {
        const respuesta = await fetch('/api/borrarIndiceHistoriales');
        const datos = await respuesta.json();
        if (datos.error) {
            pre.innerHTML = cardError({ mensaje: datos.error }, query);
        } else {
            pre.innerHTML = cardExito(datos.mensaje, { indice: 'idx_historiales_usuario_fecha' }, query);
        }
    } catch (error) {
        pre.innerHTML = cardError({ mensaje: error.message }, query);
    }
}