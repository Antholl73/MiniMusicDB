CREATE TABLE reproducciones(
id VARCHAR(50), -- REVIEW: verificar si esto deberia ser integer
id_cancion INTEGER,
id_usuario INTEGER,
estado BOOLEAN NOT NULL,
tiempo_actual REAL CHECK (tiempo_actual >= 0),

PRIMARY KEY(id, id_cancion, id_usuario),

CONSTRAINT fk_usuario_reproduccion
FOREIGN KEY(id_usuario)
REFERENCES usuarios(id),

CONSTRAINT fk_cancion_reproduccion
FOREIGN KEY(id_cancion)
REFERENCES canciones(id)
);
