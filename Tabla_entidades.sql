id_discografia SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuario(
id_usuario SERIAL PRIMARY KEY,
correo VARCHAR(50) UNIQUE ,
nombre VARCHAR(50) NOT NULL
);

CREATE TABLE genero(
id_genero serial PRIMARY KEY,
nombre VARCHAR(50) NOT NULL
);
