SELECT id_album, COUNT(*) AS total_canciones
FROM canciones
GROUP BY id_album;