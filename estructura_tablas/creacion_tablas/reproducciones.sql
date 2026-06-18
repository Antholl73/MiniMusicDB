CREATE TABLE reproducciones(
    id_usuario INTEGER,
    id_cancion INTEGER,
    estado BOOLEAN NOT NULL,
    tiempo_actual INTEGER CHECK (tiempo_actual >= 0),

    PRIMARY KEY(id_usuario, id_cancion),

CONSTRAINT fk_usuario_reproducciones
    FOREIGN KEY(id_usuario)
    REFERENCES usuarios(id),
CONSTRAINT fk_cancion_reproducciones
    FOREIGN KEY(id_cancion)
    REFERENCES canciones(id)
);