package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

public enum MensajesDeError {
    ADMIN_YA_CONFIGURADO("El administrador ya ha sido configurado previamente", 403),
    CREDENCIALES_INVALIDAS("Credenciales inválidas. Revisa tu correo o contraseña", 401),
    DATOS_INVALIDOS("Los datos enviados son invalidos o no cumplen con el formato requerido", 400),
    ACCESO_DENEGADO("No cuentas con los permisos necesarios para realizar esta operacion", 403),
    SIN_PERMISOS_DOCENTE(
            "No cuentas con permisos de docente en esta clase de Google Classroom", 403),
    RECURSO_NO_ENCONTRADO("El recurso solicitado no fue encontrado", 404),
    METODO_NO_PERMITIDO("Metodo HTTP no permitido para este endpoint", 405),
    LIMITE_PETICIONES_EXCEDIDO(
            "Se ha superado el limite de solicitudes hacia Google Classroom. Intenta nuevamente mas"
                    + " tarde",
            429),
    ERROR_CONFIGURACION_GOOGLE(
            "El servicio de Google Classroom no se encuentra disponible o no esta configurado"
                    + " adecuadamente",
            503),
    ERROR_COMUNICACION_GOOGLE(
            "No fue posible comunicarse con los servidores de Google Classroom. Por favor,"
                    + " reintenta la operacion",
            502),
    TIEMPO_ESPERA_AGOTADO(
            "El tiempo de espera para obtener respuesta de Google Classroom ha expirado", 504),
    CONTRASENA_ACTUAL_INCORRECTA("La contraseña actual es incorrecta", 400),
    CONTRASENA_NUEVA_IGUAL("La nueva contraseña no puede ser identica a la contraseña actual", 400),
    DEMASIADOS_INTENTOS_LOGIN(
            "Has superado el limite de intentos de inicio de sesion. Por favor, espera un minuto"
                    + " antes de reintentar.",
            429),
    DEMASIADOS_INTENTOS_CONTRASENA(
            "Has superado el limite de intentos permitidos. Por favor, espera un minuto antes de"
                    + " reintentar.",
            429),
    ERROR_INTERNO(
            "Ocurrio un error interno al procesar la solicitud. Contacta al administrador si el"
                    + " problema persiste",
            500);

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
