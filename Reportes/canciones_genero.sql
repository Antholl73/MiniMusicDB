SELECT id_genero, COUNT(*) AS total
FROM canciones
GROUP BY id_genero;