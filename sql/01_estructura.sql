CREATE TABLE IF NOT EXISTS auth.usuarios (
    id UUID PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS configuracion.configuracion_sistema (
    id UUID PRIMARY KEY,
    google_client_id VARCHAR(500),
    google_client_secret VARCHAR(1000),
    google_refresh_token VARCHAR(1000),
    google_drive_folder_id VARCHAR(255),
    google_drive_folder_name VARCHAR(255)
);