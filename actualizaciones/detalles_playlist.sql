BEGIN;
UPDATE detalles_playlist 
SET posicion = 2
WHERE id_playlist = 1 AND id_cancion = 1;

UPDATE detalles_playlist 
SET posicion = 1
WHERE id_playlist = 1 AND id_cancion = 2;
COMMIT;
