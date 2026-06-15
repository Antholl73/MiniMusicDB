--modificacion playlist
UPDATE playlists
SET nombre = 'Playlist de Juan'
WHERE id = 1 ;

--modificacion detalles_playlist
BEGIN;
UPDATE detalles_playlist 
SET posicion = 2
WHERE id_playlist = 1 AND id_cancion = 1;

UPDATE detalles_playlist 
SET posicion = 1
WHERE id_playlist = 1 AND id_cancion = 2;
COMMIT;

--modificacion discograficas
UPDATE discograficas 
SET nombre='YT music'
WHERE nombre='Prime music';

--modificacion usuarios
UPDATE usuarios
SET correo = 'eljuan_alcachofa@gmail.com'
WHERE nombre = 'Juan';

--modificacion a artistas
UPDATE artistas
SET nombre='El Rey del Pop'  
WHERE nombre='Michael Jackson';

--modificacion a albumes
UPDATE albumes
SET nombre_album='The best pop music'
WHERE nombre_album='Thriller';

--modificacion comentarios
UPDATE comentarios
SET texto = 'me gusta'
WHERE id=1;
