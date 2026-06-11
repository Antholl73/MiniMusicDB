BEGIN;

-- 1. Insertar el nuevo álbum (Tabla 1)
INSERT INTO albumes (id, id_artista, id_discografica, nombre_album, fecha_lanzamiento) 
VALUES (15, 1, 1, 'Plastic Beach', '2010-03-03');

-- 2. Insertar la primera canción de ese álbum (Tabla 2)
-- Usamos RETURNING id para capturar el ID autogenerado de la canción
INSERT INTO canciones (id_album, id_artista, id_genero, nombre, duracion) 
VALUES (15, 1, 3, 'On Melancholy Hill', 4.18)
RETURNING id;

-- 3. Insertar la letra de la canción recién creada (Tabla 3)
-- (Suponiendo que el RETURNING id nos devolvió el número 15)
INSERT INTO letras_cancion (id_cancion, id_idioma, contenido) 
VALUES (15, 2, 'Up on melancholy hill there is a plastic tree...');

COMMIT;
