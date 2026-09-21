ALTER TABLE configuracion.configuracion_sistema 
ADD COLUMN IF NOT EXISTS google_drive_folder_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS google_drive_folder_name VARCHAR(255);
