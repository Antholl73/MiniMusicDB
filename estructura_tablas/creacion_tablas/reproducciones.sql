CREATE TABLE reproducciones(
n_reproduccion INTEGER, -- FIX: integer, y renombramiento para mostrar la funcion
id_cancion INTEGER,
id_usuario INTEGER,
estado BOOLEAN NOT NULL,
fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

PRIMARY KEY(n_reproduccion, id_cancion, id_usuario),

CONSTRAINT fk_usuario_reproduccion
FOREIGN KEY(id_usuario)
REFERENCES usuarios(id),

CONSTRAINT fk_cancion_reproduccion
FOREIGN KEY(id_cancion)
REFERENCES canciones(id)
);
