ALTER TABLE reproducciones
DROP CONSTRAINT reproducciones_pkey,
DROP COLUMN id,
ADD CONSTRAINT reproducciones_pkey
PRIMARY KEY (id_usuario, id_cancion);