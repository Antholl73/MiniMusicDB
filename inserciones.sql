-- Inserciones para la tabla generos
INSERT INTO generos (nombre) VALUES
('Salsa'),
('Reggaeton'),
('Pop'),
('Rock'),
('Metal'),
('Electrónica'),
('Jazz'),
('Hip Hop'),
('Bachata'),
('K-pop'),
('Clásica'),
('Trap'),
('House'),
('Reggae');

-- Inserciones para la tabla idiomas
INSERT INTO idiomas (nombre) VALUES
('Español'),
('Inglés'),
('Portugués'),
('Francés'),
('Coreano'),
('Japonés'),
('Italiano'),
('Alemán'),
('Chino'),
('Ruso'),
('Sueco'),
('Latín');

-- Inserciones para la tabla artistas
INSERT INTO artistas (nombre) VALUES
('Gorillaz'),
('Michael Jackson'),
('Metallica'),
('Dua Lipa'),
('Rammstein'),
('Linkin Park'),
('Coldplay'),
('Adele'),
('Bruno Mars'),
('Eminem'),
('Shakira'),
('Daft Punk'),
('Billie Eilish'),
('Marc Anthony');

-- Inserciones para la tabla discograficas
INSERT INTO discograficas (nombre) VALUES
('Universal music'),
('Prime music'),
('Malditos music'),
('Sony Music'),
('Warner Music'),
('EMI Records'),
('Atlantic Records'),
('Columbia Records'),
('Def Jam Recordings'),
('Interscope Records'),
('Aftermath Entertainment'),
('Parlophone');

-- Inserciones para la tabla usuarios
INSERT INTO usuarios (correo, nombre) VALUES
('juanitoAlcachofa@gmail.com', 'Juan'),
('muchacho_bien777@gmail.com', 'Alberto'),
('ElsaPato34@gmail.com', 'Antholl73'),
('marcelo_pro123@gmail.com', 'Marcelo_Ortiz'),
('sofia_music99@gmail.com', 'Sofia'),
('pedrorock@gmail.com', 'Pedro'),
('lucia_pop@gmail.com', 'Lucia'),
('diego_metal@gmail.com', 'Diego'),
('carlos_jazz@gmail.com', 'Carlos'),
('maria_gomez@gmail.com', 'Maria'),
('ana_reggae@gmail.com', 'Ana'),
('luis_salsa@gmail.com', 'Luis');

-- Inserciones para la tabla albumes
INSERT INTO albumes(id, id_artista, id_discografica, nombre_album, fecha_lanzamiento) VALUES
(1, 1, 1, 'Demon Days', '2005-05-11'),
(2, 2, 4, 'Thriller', '1982-11-30'),
(3, 3, 1, 'Master of Puppets', '1986-03-03'),
(4, 4, 4, 'Future Nostalgia', '2020-03-27'),
(5, 5, 5, 'Mutter', '2001-04-02'),
(6, 6, 6, 'Hybrid Theory', '2000-10-24'),
(7, 7, 7, 'Parachutes', '2000-07-10'),
(8, 8, 8, '21', '2011-01-24'),
(9, 9, 4, 'Unorthodox Jukebox', '2012-12-10'),
(10, 10, 9, 'The Eminem Show', '2002-05-26'),
(11, 11, 4, 'Pies Descalzos', '1995-10-06'),
(12, 12, 10, 'Random Access Memories', '2013-05-17'),
(13, 13, 10, 'When We All Fall Asleep, Where Do We Go?', '2019-03-29'),
(14, 14, 4, '3.0', '2013-07-23');

-- Inserciones para la tabla canciones
INSERT INTO canciones (id_album,id_artista,id_genero,nombre,duracion) VALUES
(1,1,1,'Homura',4.34),
(2,2,2,'Thriller',5.57),
(3,3,5,'Master of Puppets',8.36),
(4,4,3,'Levitating',3.23),
(5,5,5,'Sonne',4.32),
(6,6,8,'In the End',3.36),
(7,7,7,'Yellow',4.28),
(8,8,3,'Rolling in the Deep',3.48),
(9,9,3,'Locked Out of Heaven',3.53),
(10,10,8,'Without Me',4.50),
(11,11,3,'Estoy Aquí',3.52),
(12,12,6,'Get Lucky',6.09),
(13,13,3,'Bad Guy',3.14),
(14,14,1,'Vivir Mi Vida',4.12);

-- Inserciones para la tabla letras_cancion
INSERT INTO letras_cancion(id_cancion,id_idioma,contenido) VALUES 
(1, 1, 'Gritando adios y gracias...'),
(1, 2, 'Goodbye and thank you...'),
(2, 2, 'Its close to midnight...'),
(3, 2, 'End of passion play, crumbling away...'),
(4, 2, 'Billboard Baby...'),
(5, 7, 'Hier kommt git pdie Sonne...'),
(6, 2, 'It starts with one thing...'),
(7, 2, 'Look at the stars...'),
(8, 2, 'There is a fire starting in my heart...'),
(9, 2, 'Never had much faith in love or miracles...'),
(10, 2, 'Obie Trice, real name no gimmicks...'),
(11, 1, 'Ya sé que no vendrás, todo lo que fue...'),
(12, 2, 'Like the legend of the phoenix...'),
(13, 2, 'White shirt now red, my bloody nose...'),
(14, 1, 'Voy a reír, voy a bailar, vivir mi vida, la la la la...');

-- Inserciones para la tabla calificaciones
INSERT INTO calificaciones(id_usuario,id_cancion,valoracion) VALUES
(1,1,1),
(2,1,3),
(3,3,4),
(2,4,5),
(4,2,3),
(5,5,5),
(6,6,4),
(7,7,5),
(8,8,5),
(9,9,5),
(10,10,4),
(11,11,5),
(12,12,4),
(1,13,5),
(3,14,5),
(5,9,4),
(6,10,5);

-- Inserciones para la tabla comentarios
INSERT INTO comentarios(id_usuario,id_cancion,texto) VALUES
(1,1,'lo odiooo'),
(2,1,'esta bien'),
(1,4,'XD'),
(4,4,'sin comentarios...'),
(5,5,'Buenísima canción'),
(6,6,'Me encanta'),
(7,7,'Mi favorita'),
(8,8,'Excelente voz'),
(9,9,'¡Me hace bailar!'),
(10,10,'Un clásico del rap.'),
(11,11,'Qué recuerdos de los 90.'),
(12,12,'Daft Punk es legendario.'),
(1,13,'Increíble producción de Billie.'),
(3,14,'¡Para alegrar el día!');

-- Inserciones para la tabla reproducciones
INSERT INTO reproducciones(id,id_cancion,id_usuario,estado,tiempo_actual) VALUES
('repro-001',1,3,FALSE,0.6),
('repro-002',1,3,FALSE,5.6),
('repro-003',2,3,FALSE,5.4),
('repro-004',4,3,TRUE,4.4),
('repro-005',5,5,FALSE,2.5),
('repro-006',6,6,TRUE,1.8),
('repro-007',7,7,FALSE,3.0),
('repro-008',8,8,TRUE,2.2),
('repro-009',9,9,TRUE,3.5),
('repro-010',10,10,FALSE,4.1),
('repro-011',11,11,TRUE,1.2),
('repro-012',12,12,FALSE,2.8),
('repro-013',13,1,TRUE,3.1),
('repro-014',14,3,TRUE,4.0);

-- Inserciones para la tabla playlists
INSERT INTO playlists (tipo, nombre, tamano_ranking, decada, descripcion) VALUES
('personalizada', 'Mi playlist personal', NULL, NULL, NULL),
('calificacion', 'Mis mejores 5 canciones', 5, NULL, NULL),
('favoritos', 'Favoritas de Sofia', NULL, NULL, 'Mis canciones favoritas'),
('personalizada', 'Rock clásico', NULL, NULL, 'Solo rock'),
('historial', 'Escuchadas recientemente', NULL, NULL, 'Historial personal'),
('por_decadas', 'Hits 2000', NULL, NULL, 'Lo mejor de los 2000'),
('favoritos', 'Top pop', NULL, NULL, 'Mis favoritas de pop'),
('personalizada', 'Modo estudio', NULL, NULL, 'Música tranquila'),
('por_decadas', 'Hits 90s', NULL, 1990, 'Lo mejor de los 90'),
('personalizada', 'Para correr', NULL, NULL, 'Música energética'),
('personalizada', 'Salsa para bailar', NULL, NULL, 'Solo salsa brava y sensual');

-- Inserciones para la tabla detalles_playlist
INSERT INTO detalles_playlist(id_playlist, id_cancion, posicion) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1),
(2, 4, 2),
(3, 5, 1),
(4, 6, 1),
(5, 7, 1),
(6, 8, 1),
(7, 3, 1),
(7, 4, 2),
(7, 8, 3),
(8, 12, 1),
(8, 13, 2),
(9, 11, 1),
(10, 10, 1),
(10, 6, 2),
(11, 14, 1);

-- Inserciones para la tabla historiales
INSERT INTO historiales(id,id_usuario,id_cancion,fecha) VALUES
(1,1,1,'2026-05-20'),
(2,2,2,'2026-05-21'),
(3,3,3,'2026-05-22'),
(4,4,4,'2026-05-23'),
(5,5,5,'2026-05-24'),
(6,6,6,'2026-05-25'),
(7,7,7,'2026-05-26'),
(8,8,8,'2026-05-27'),
(9,9,9,'2026-05-28'),
(10,10,10,'2026-05-29'),
(11,11,11,'2026-05-30'),
(12,12,12,'2026-05-31'),
(13,1,13,'2026-06-01'),
(14,2,14,'2026-06-02'),
(15,3,9,'2026-06-03'),
(16,4,10,'2026-06-04');
