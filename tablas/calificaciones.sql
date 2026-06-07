CREATE TABLE calificaciones(
--FIX: Se removio la Primary Key de calificaciones porque un usuario no puede hacer varias calificaciones al mismo tiempo
id_usuario INTEGER,
id_cancion INTEGER,
valoracion INTEGER NOT NULL,

PRIMARY KEY(id_usuario, id_cancion),

CONSTRAINT fk_usuario_calificacion
FOREIGN KEY(id_usuario)
REFERENCES usuarios(id),

CONSTRAINT fk_cancion_calificacion
FOREIGN KEY(id_cancion)
REFERENCES canciones(id),

CONSTRAINT valoracion_calificacion CHECK (valoracion BETWEEN 0 AND 5)
-- NOTE: Esto antes era un float, lo cambie para valorar segun estrellas (0-5) 
);
