--Utilizando el script de tablas que crearon en la clase anterior, deben poblar 8 de sus tablas.
--Mínimo 5 registros por tabla para cumplir la rúbrica.
--¡Cuidado con el orden! No pueden poblar una tabla hija (ej: Pedidos) si antes no han poblado la tabla
--padre (Clientes), debido a las Llaves Foráneas.

--Llenado tabla generos
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
('Luis Miguel'),
('Bad Bunny'),
('Metallica'),
('Dua Lipa'),
('Marc Anthony');
