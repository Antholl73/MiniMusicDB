CREATE TABLE letras_cancion(

id_cancion INTEGER,
id_idioma INTEGER,
contenido TEXT NOT NULL,

PRIMARY KEY(id_cancion, id_idioma),

CONSTRAINT fk_cancion_letras
FOREIGN KEY(id_cancion)
REFERENCES canciones(id),

CONSTRAINT fk_idioma_letras
FOREIGN KEY(id_idioma)
REFERENCES idiomas(id)
);
