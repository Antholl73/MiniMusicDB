--Utilizando el script de tablas que crearon en la clase anterior, deben poblar 8 de sus tablas.
--Mínimo 5 registros por tabla para cumplir la rúbrica.
--¡Cuidado con el orden! No pueden poblar una tabla hija (ej: Pedidos) si antes no han poblado la tabla
--padre (Clientes), debido a las Llaves Foráneas.


INSERT INTO generos (nombre) VALUES
('Salsa'),
('Reggaeton'),
('Pop'),
('Rock'),
('Metal');

--Llenado tabla idiomas
INSERT INTO idiomas (nombre) VALUES
('Español'),
('Inglés'),
('Portugués'),
('Francés'),
('Coreano');

--Llenado tabla artistas
INSERT INTO artistas (nombre) VALUES
('Gorillaz'),
('Michael Jackson'),
('Metallica'),
('Dua Lipa'),
('Rammstein');--fix:faltaba ;

--Llenado tabla discográficas
INSERT INTO discograficas (nombre) VALUES
('Universal music'),
('Prime music'),
('Malditos music'),
('Sony Music');

INSERT INTO usuarios (correo, nombre) VALUES
('juanitoAlcachofa@gmail.com', 'Juan'),
('muchacho_bien777@gmail.com', 'Alberto'),
('ElsaPato34@gmail.com', 'Antholl73'),
('marcelo_pro123@gmail.com', 'Marcelo_Ortiz');

--LLenado tabla albumes
INSERT INTO albumes(id, id_artista, id_discografica, nombre_album, fecha_lanzamiento) VALUES
(1, 1, 1, 'Demon Days', '2005-05-11'),
(2, 2, 4, 'Thriller', '1982-11-30'),
(3, 3, 1, 'Master of Puppets', '1986-03-03'),
(4, 4, 4, 'Future Nostalgia', '2020-03-27');

--LLenado de tabla canciones
INSERT INTO canciones (id_album,id_artista,id_genero,nombre,duracion) VALUES
(1,1,1,'Homura',4.34),
(2,2,2,'Thriller',5.57),
(3,3,5,'Master of Puppets',8.36),
(4,4,3,'Levitating',3.23);

--Llenado tabla playlists

INSERT INTO playlists (tipo, nombre_playlist) 
VALUES ('personalizada','Mi playlist personal');

INSERT INTO playlists (tipo, nombre_playlist, tamano_ranking) 
VALUES ('calificacion','Mis mejores 5 canciones', 5);

--Llenado tabla detalles_playlist

INSERT INTO detalles_playlist(id_playlist, id_cancion, posicion)
VALUES (1, 1, 1);

INSERT INTO detalles_playlist(id_playlist, id_cancion, posicion)
VALUES (1, 2, 2);

--Modificacion

--modificacion discograficas

UPDATE discograficas 
SET nombre='YT music'
WHERE nombre='Prime music';

--modificacion usuarios
UPDATE usuarios
SET correo = 'eljuan_alcachofa@gmail.com'
WHERE nombre = 'juan';


