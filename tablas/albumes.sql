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
