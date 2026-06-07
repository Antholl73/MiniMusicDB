CREATE TABLE comentarios(
id SERIAL, --FIX: PRIMARY KEY va abajo
id_usuario INTEGER,
id_cancion INTEGER,
texto TEXT NOT NULL,
fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,--fix::faltaba una coma

PRIMARY KEY(id_usuario, id_cancion, id), --FIX:: la PRIMARY KEY debería ser una combinación de id_usuario, id_canción, id_comentario

CONSTRAINT fk_usuario_comentarios
FOREIGN KEY(id_usuario)
REFERENCES usuarios(id),

CONSTRAINT fk_cancion_comentarios
FOREIGN KEY(id_cancion)
REFERENCES canciones(id)

);
