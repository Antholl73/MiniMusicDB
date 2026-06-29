SELECT
    d.id                                        AS id_discografica,
    d.nombre                                    AS discografica,
    COUNT(h.id)                                 AS total_escuchas,
    COUNT(DISTINCT c.id)                        AS canciones_distintas,
    COUNT(DISTINCT h.id_usuario)                AS oyentes_unicos,
    MIN(h.fecha)                                AS primera_escucha,
    MAX(h.fecha)                                AS ultima_escucha
FROM historiales h
INNER JOIN canciones    c ON h.id_cancion  = c.id
INNER JOIN albumes      a ON c.id_album    = a.id
                          AND c.id_artista = a.id_artista
INNER JOIN discograficas d ON a.id_discografica = d.id
WHERE
    h.fecha >= $1
    AND h.fecha <= $2
GROUP BY
    d.id,
    d.nombre
HAVING
    COUNT(h.id) >= 1
ORDER BY
    total_escuchas  DESC,
    oyentes_unicos  DESC;
