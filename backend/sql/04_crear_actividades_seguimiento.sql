CREATE SCHEMA IF NOT EXISTS seguimiento;

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

CREATE INDEX IF NOT EXISTS idx_actividades_seguimiento_plantilla
    ON seguimiento.actividades_seguimiento (id_plantilla_drive);

CREATE INDEX IF NOT EXISTS idx_actividades_seguimiento_clase
    ON seguimiento.actividades_seguimiento (id_clase_classroom);
