ALTER TABLE canciones
DROP COLUMN letra_cacnion,
ADD COLUMN letras JSONB;
