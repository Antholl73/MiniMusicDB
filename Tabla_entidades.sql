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