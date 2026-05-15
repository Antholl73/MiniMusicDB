CREATE TABLE discografias (
id_discografia SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios(
id_usuario SERIAL PRIMARY KEY,
correo VARCHAR(50) UNIQUE ,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE generos(
id_genero serial PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE idiomas(
id_idioma VARCHAR(50) PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);



CREATE TABLE artistas(
id_artista VARCHAR(50) PRIMARY KEY,
nombre VARCHAR(50) Not NULL
);

CREATE TABLE albumes(
  id_album VARCHAR(50) PRIMARY KEY,
  id_artista VARCHAR(50),
  id_discografia INT,
  nombre_album VARCHAR(50),
  fecha_lanzamiento DATE,
  
  FOREIGN KEY (id_artista)
  REFERENCES artistas(id_artista),

  FOREIGN KEY (id_discografia)
  REFERENCES discografias(id_discografia)
);


CREATE TABLE canciones(
id_cancion SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
duracion float,
id_album VARCHAR(50),
id_genero INT,

FOREIGN KEY (id_album)
REFERENCES albumes(id_album),
FOREIGN KEY (id_genero)
REFERENCES generos(id_genero)

);

CREATE TABLE letra_canciones(

id_letra serial PRIMARY KEY,
contenido text,
id_cancion int,
id_idioma VARCHAR(50),

FOREIGN KEY(id_cancion)
REFERENCES canciones(id_cancion),
FOREIGN KEY(id_idioma)
REFERENCES idiomas(id_idioma)
);

Create table calificaciones(
id_usuario int,
id_cancion int,
valoracion float,

FOREIGN KEY(id_usuario)
REFERENCES usuarios(id_usuario),
FOREIGN KEY(id_cancion)
REFERENCES canciones(id_cancion)

);

Create table comentarios(
id_usuario int,
id_cancion int,
texto text,

FOREIGN KEY(id_usuario)
REFERENCES usuarios(id_usuario),
FOREIGN KEY(id_cancion)
REFERENCES canciones(id_cancion)

);

Create table reproducciones(
id_reproduccion VARCHAR(50) PRIMARY KEY,
estado BOOLEAN not NULL,
tiempo_actual float,
id_cancion int,
id_usuario int,
FOREIGN KEY(id_usuario)
REFERENCES usuarios(id_usuario),
FOREIGN KEY(id_cancion)
REFERENCES canciones(id_cancion)



);
CREATE TABLE playlists(
id SERIAL PRIMARY KEY,
tipo VARCHAR(13) NOT NULL,
nombre_playlist VARCHAR (30) NOT NULL UNIQUE,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
tamano_ranking INTEGER,
decada INTEGER,
descripcion TEXT,

CONSTRAINT descripcion_tamano CHECK (char_length(descripcion) < 600),
CONSTRAINT tipo_playlists CHECK (tipo IN ('historial','calificacion','favoritos','por_decadas','personalizada'))
);

create table detalles_playlist(
id int,
id_cancion int,
posicion INTEGER,
FOREIGN KEY (id)
REFERENCES playlists(id),
FOREIGN KEY (id_cancion)
REFERENCES canciones(id_cancion)

);

create table historiales(
id_historial serial,
fecha date not null,
id_usuario int,
id_cancion int,
id int,
FOREIGN KEY (id_usuario)
REFERENCES usuarios(id_usuario),
FOREIGN KEY (id_cancion)
REFERENCES canciones(id_cancion),
FOREIGN KEY (id)
REFERENCES playlists(id)

);