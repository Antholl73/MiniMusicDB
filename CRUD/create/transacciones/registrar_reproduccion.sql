BEGIN;

-- PASO 1: Registrar (o actualizar) la reproduccion del usuario.
INSERT INTO reproducciones (id_usuario, id_cancion, estado, tiempo_actual)
VALUES (1, 3, TRUE, 210)
ON CONFLICT (id_usuario, id_cancion)
DO UPDATE SET
    estado        = TRUE,
    tiempo_actual = EXCLUDED.tiempo_actual;

-- PASO 2: Insertar un nuevo registro en el historial con la fecha actual.
INSERT INTO historiales (id, id_usuario, id_cancion, fecha)
VALUES (
    (SELECT COALESCE(MAX(id), 0) + 1 FROM historiales WHERE id_usuario = 1),
    1,
    3,
    CURRENT_DATE
);
COMMIT;

-- ROLLBACK;
