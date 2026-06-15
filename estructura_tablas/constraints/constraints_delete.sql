ALTER TABLE canciones
DROP CONSTRAINT IF EXISTS fk_album_cancion,
ADD CONSTRAINT fk_album_cancion
FOREIGN KEY (id_album, id_artista)
REFERENCES albumes(id, id_artista)
ON DELETE CASCADE;

ALTER TABLE calificaciones
DROP CONSTRAINT IF EXISTS fk_cancion_calificacion,
ADD CONSTRAINT fk_cancion_calificacion
FOREIGN KEY (id_cancion)
REFERENCES canciones(id)
ON DELETE CASCADE;

ALTER TABLE comentarios
DROP CONSTRAINT IF EXISTS fk_usuario_comentarios,
ADD CONSTRAINT fk_usuario_comentarios
FOREIGN KEY (id_usuario)
REFERENCES usuarios(id)
ON DELETE SET NULL;
