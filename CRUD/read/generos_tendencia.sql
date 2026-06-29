SELECT
    g.id                                        AS id_genero,
    g.nombre                                    AS genero,
    COUNT(h.id)                                 AS total_escuchas_recientes,
    COUNT(DISTINCT c.id)                        AS canciones_distintas,
    COUNT(DISTINCT h.id_usuario)                AS oyentes_unicos,
    MIN(h.fecha)                                AS primera_escucha_periodo,
    MAX(h.fecha)                                AS ultima_escucha_periodo
FROM historiales h
INNER JOIN canciones c  ON h.id_cancion = c.id
INNER JOIN generos   g  ON c.id_genero  = g.id
WHERE
    h.fecha >= CURRENT_DATE - INTERVAL '30 days'
    AND h.fecha <= CURRENT_DATE
GROUP BY
    g.id,
    g.nombre
HAVING
    COUNT(h.id) >= 1
ORDER BY
    total_escuchas_recientes DESC,
    oyentes_unicos           DESC;
