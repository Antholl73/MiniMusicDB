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
)

select * from genero;
