SELECT
    canciones.nombre AS nombre_cancion, 
    AVG(calificaciones.valoracion) AS calificacion_promedio
FROM canciones
LEFT JOIN calificaciones ON canciones.id = calificaciones.id_cancion
WHERE canciones.id_genero = 3
GROUP BY canciones.nombre, canciones.id
HAVING AVG(calificaciones.valoracion) >= 3;
