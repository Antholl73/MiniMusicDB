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
