SELECT
    c.id                                        AS id_cancion,
    c.nombre                                    AS cancion,
    a.nombre                                    AS artista,
    g.nombre                                    AS genero,
    COUNT(h.id)                                 AS total_escuchas,
    COUNT(DISTINCT h.id_usuario)                AS oyentes_unicos,
    MIN(h.fecha)                                AS primera_escucha,
    MAX(h.fecha)                                AS ultima_escucha
FROM historiales h
INNER JOIN canciones c ON h.id_cancion = c.id
INNER JOIN artistas  a ON c.id_artista = a.id
INNER JOIN generos   g ON c.id_genero  = g.id
WHERE
    h.fecha >= $1
    AND h.fecha <= $2
GROUP BY
    c.id,
    c.nombre,
    a.nombre,
    g.nombre
HAVING
    COUNT(h.id) >= 1
ORDER BY
    total_escuchas  DESC,
    oyentes_unicos  DESC;
