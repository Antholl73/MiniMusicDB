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

