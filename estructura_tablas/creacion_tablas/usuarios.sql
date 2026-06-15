CREATE TABLE usuarios(
id SERIAL PRIMARY KEY,
correo VARCHAR(50) NOT NULL UNIQUE, --FIX: Ahora correo es UNIQUE porque dos usuarios no pueden tener el mismo correo
nombre VARCHAR(50) NOT NULL
);
