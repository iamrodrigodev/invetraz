ALTER TABLE configuracion.configuracion_sistema 
ADD COLUMN IF NOT EXISTS google_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS drive_verificado BOOLEAN DEFAULT FALSE;

UPDATE configuracion.configuracion_sistema
SET google_verificado = FALSE
WHERE google_verificado IS NULL;

UPDATE configuracion.configuracion_sistema
SET drive_verificado = FALSE
WHERE drive_verificado IS NULL;

UPDATE configuracion.configuracion_sistema
SET drive_verificado = FALSE
WHERE google_verificado = FALSE;
