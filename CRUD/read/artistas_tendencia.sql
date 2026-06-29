SELECT
    a.id                                        AS id_artista,
    a.nombre                                    AS artista,
    COUNT(h.id)                                 AS total_escuchas,
    COUNT(DISTINCT c.id)                        AS canciones_distintas,
    COUNT(DISTINCT h.id_usuario)                AS oyentes_unicos,
    MIN(h.fecha)                                AS primera_escucha,
    MAX(h.fecha)                                AS ultima_escucha
FROM historiales h
INNER JOIN canciones c ON h.id_cancion = c.id
INNER JOIN artistas  a ON c.id_artista = a.id
WHERE
    h.fecha >= $1
    AND h.fecha <= $2
GROUP BY
    a.id,
    a.nombre
HAVING
    COUNT(h.id) >= 1
ORDER BY
    total_escuchas  DESC,
    oyentes_unicos  DESC;
