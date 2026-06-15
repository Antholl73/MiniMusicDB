SELECT 
    g.nombre                           AS nombre_genero, 
    COUNT(r.id)                        AS total_reproducciones,
    ROUND(AVG(c.duracion)::numeric, 2) AS duracion_promedio_cancion
FROM generos g
INNER JOIN canciones c      ON g.id = c.id_genero
INNER JOIN reproducciones r ON c.id = r.id_cancion
GROUP BY 
    g.id, 
    g.nombre
HAVING 
    COUNT(r.id) >= 2
ORDER BY 
    total_reproducciones DESC;
