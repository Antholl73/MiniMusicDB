CREATE TABLE discografia (
id_discografia SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuario(
id_usuario SERIAL PRIMARY KEY,
correo VARCHAR(50) UNIQUE KEY,
nombre VARCHAR(50) NOT NULL
);
