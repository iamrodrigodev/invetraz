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
    google_drive_folder_name VARCHAR(255),
    google_verificado BOOLEAN DEFAULT FALSE,
    drive_verificado BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS seguimiento.actividades_seguimiento (
    id UUID PRIMARY KEY,
    id_tarea_classroom VARCHAR(100) NOT NULL UNIQUE,
    id_clase_classroom VARCHAR(100) NOT NULL,
    nombre_clase VARCHAR(255),
    id_tema_classroom VARCHAR(100),
    nombre_tema VARCHAR(255),
    id_plantilla_drive VARCHAR(255) NOT NULL,
    nombre_plantilla VARCHAR(255),
    enlace_plantilla VARCHAR(1000),
    titulo VARCHAR(3000) NOT NULL,
    descripcion VARCHAR(2000),
    fecha_limite TIMESTAMP,
    puntaje_maximo DOUBLE PRECISION,
    estado VARCHAR(50) NOT NULL,
    enlace_tarea VARCHAR(1000),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);