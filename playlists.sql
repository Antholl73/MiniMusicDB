CREATE TABLE playlists(
id SERIAL PRIMARY KEY,
tipo VARCHAR(13) NOT NULL,
nombre VARCHAR (30) NOT NULL UNIQUE,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
tamano_ranking INTEGER,
decada INTEGER,
descripcion TEXT,

CONSTRAINT descripcion_tamano CHECK (char_length(descripcion) < 600),
CONSTRAINT tipo_playlists CHECK (tipo IN ('historial','calificacion','favoritos','por_decadas','personalizada'))
);