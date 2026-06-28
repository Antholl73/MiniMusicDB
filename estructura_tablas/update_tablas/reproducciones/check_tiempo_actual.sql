ALTER TABLE reproducciones
DROP CONSTRAINT reproducciones_tiempo_actual_check,
ADD CONSTRAINT reproducciones_tiempo_actual_check
CHECK (tiempo_actual > 0);