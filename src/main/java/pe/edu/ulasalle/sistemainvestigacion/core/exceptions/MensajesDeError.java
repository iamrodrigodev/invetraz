package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

public enum MensajesDeError {
    DATOS_INVALIDOS("Datos de entrada invalidos", 400),
    CREDENCIALES_INVALIDAS("Credenciales incorrectas", 401),
    ERROR_INTERNO("Error interno del servidor", 500),
    ACCESO_DENEGADO("Acceso denegado", 403),
    NO_AUTORIZADO("No autorizado", 401),
    RECURSO_NO_ENCONTRADO("Recurso no encontrado", 404),
    TOKEN_INVALIDO("Token invalido o no encontrado", 400),
    TOKEN_EXPIRADO("El token ha expirado. Por favor solicita uno nuevo.", 400),
    METODO_NO_PERMITIDO("Metodo no permitido para este endpoint", 405),
    ERROR_GENERAL("Ocurrio un error al procesar la solicitud.", 500),
    ERROR_CREDENCIALES_GOOGLE_NO_ENCONTRADAS(
            "Falta el archivo google-credentials.json en src/main/resources", 500),
    ERROR_CREDENCIALES_GOOGLE_INVALIDAS("Error al configurar el cliente de Google Classroom", 500),
    SIN_PERMISOS_DOCENTE("No tienes permisos de docente para gestionar tareas en esta clase", 403);

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
