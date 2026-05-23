CREATE TABLE discograficas (
id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios(
id SERIAL PRIMARY KEY,
correo VARCHAR(50) NOT NULL UNIQUE, --FIX: Ahora correo es UNIQUE porque dos usuarios no pueden tener el mismo correo
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE generos(
id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE idiomas(
id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE artistas(
id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE albumes(
  id INTEGER,
  id_artista INTEGER,
  id_discografica INTEGER, --FIX: Se quitó UNIQUE porque una discografica puede tener varios albumes (uno a muchos)
  nombre_album VARCHAR(60) NOT NULL,
  fecha_lanzamiento DATE NOT NULL,
  
  PRIMARY KEY(id, id_artista),

  CONSTRAINT fk_artista_album
  FOREIGN KEY (id_artista)
  REFERENCES artistas(id),

  CONSTRAINT fk_discografica_album
  FOREIGN KEY (id_discografica)
  REFERENCES discograficas(id)
);

CREATE TABLE canciones(
id SERIAL PRIMARY KEY,
id_album INTEGER, --FIX: Album se identifica con dos pk, asi que deberiamos tambien agarrar dos si queremos referenciar. Cambiar SQL y cambiar MR.
id_artista INTEGER, 
id_genero INTEGER,

nombre VARCHAR(50) NOT NULL,
duracion REAL NOT NULL CHECK (duracion > 0 ),

CONSTRAINT fk_album_cancion
FOREIGN KEY (id_album, id_artista)  --FIX: La tabla albumes tiene una Primary Key compuesta, por lo que necesita id e id_artista.
REFERENCES albumes(id, id_artista), --FIX: La tabla albumes tiene una Primary Key compuesta, por lo que necesita id e id_artista.

CONSTRAINT fk_genero_cancion
FOREIGN KEY (id_genero)
REFERENCES generos(id)

);

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

CREATE TABLE detalles_playlist(
id_playlist INTEGER,
id_cancion INTEGER,
posicion INTEGER NOT NULL,

PRIMARY KEY(id_playlist, id_cancion),

CONSTRAINT posicion_unica
    UNIQUE(id_playlist, posicion)
    DEFERRABLE INITIALLY DEFERRED,
CONSTRAINT posicion_positiva
    CHECK (posicion > 0),
CONSTRAINT fk_playlist_detalles
    FOREIGN KEY (id_playlist)
    REFERENCES playlists(id),
CONSTRAINT fk_cancion_detalles
    FOREIGN KEY (id_cancion)
    REFERENCES canciones(id)
);

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
