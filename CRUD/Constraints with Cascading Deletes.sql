ALTER TABLE canciones
DROP CONSTRAINT IF EXISTS canciones_id_artista_fkey,
ADD CONSTRAINT canciones_id_artista_fkey 
FOREIGN KEY (id_artista) 
REFERENCES artistas(id) 
ON DELETE CASCADE;

ALTER TABLE calificaciones
DROP CONSTRAINT IF EXISTS calificaciones_id_cancion_fkey,
DROP constraint IF EXISTS fk_cancion_calificacion,
ADD CONSTRAINT calificaciones_id_cancion_fkey
FOREIGN KEY (id_cancion) 
REFERENCES canciones(id) 
ON DELETE CASCADE;

ALTER TABLE comentarios
DROP CONSTRAINT IF EXISTS comentarios_id_cancion_fkey,
DROP CONSTRAINT IF EXISTS fk_usuario_comentarios,
ADD CONSTRAINT comentarios_id_cancion_fkey
FOREIGN KEY (id_usuario) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;
