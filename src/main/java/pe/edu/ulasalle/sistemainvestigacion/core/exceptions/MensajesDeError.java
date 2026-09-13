package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

public enum MensajesDeError {
    DATOS_INVALIDOS("Datos de entrada invalidos", 400),
    ACCESO_DENEGADO("Acceso denegado", 403),
    SIN_PERMISOS_DOCENTE("No tienes permisos de docente para gestionar tareas en esta clase", 403),
    RECURSO_NO_ENCONTRADO("Recurso no encontrado", 404),
    METODO_NO_PERMITIDO("Metodo no permitido para este endpoint", 405),
    ERROR_INTERNO("Error interno del servidor", 500),
    ERROR_CONFIGURACION_GOOGLE("Error en la configuracion del servicio de Google Classroom", 500);

    private final String mensaje;
    private final int codigo;

    MensajesDeError(String mensaje, int codigo) {
        this.mensaje = mensaje;
        this.codigo = codigo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public int getCodigo() {
        return codigo;
    }
}
