CREATE TABLE historiales(
id INTEGER,
id_usuario INTEGER,
id_cancion INTEGER,
fecha DATE NOT NULL,

PRIMARY KEY (id, id_usuario, id_cancion),

CONSTRAINT fk_usuario_historial
	FOREIGN KEY (id_usuario)
	REFERENCES usuarios(id),

CONSTRAINT fk_cancion_historial
	FOREIGN KEY (id_cancion)
	REFERENCES canciones(id)
);
