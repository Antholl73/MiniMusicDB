-- Actualización para la tabla playlists
UPDATE playlists
SET nombre = 'Playlist de Juan'
WHERE id = 1 ;

-- Actualización para la tabla detalles_playlist
BEGIN;
UPDATE detalles_playlist 
SET posicion = 2
WHERE id_playlist = 1 AND id_cancion = 1;

UPDATE detalles_playlist 
SET posicion = 1
WHERE id_playlist = 1 AND id_cancion = 2;
COMMIT;

-- Actualización para la tabla discograficas
UPDATE discograficas 
SET nombre='YT music'
WHERE nombre='Prime music';

-- Actualización para la tabla usuarios
UPDATE usuarios
SET correo = 'eljuan_alcachofa@gmail.com'
WHERE nombre = 'Juan';

-- Actualización para la tabla artistas
UPDATE artistas
SET nombre='El Rey del Pop'  
WHERE nombre='Michael Jackson';

-- Actualización para la tabla albumes
UPDATE albumes
SET nombre_album='The best pop music'
WHERE nombre_album='Thriller';

-- Actualización para la tabla comentarios
UPDATE comentarios
SET texto = 'me gusta'
WHERE id=1;
