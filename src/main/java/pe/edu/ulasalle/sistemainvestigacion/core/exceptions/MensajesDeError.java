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
            500),
    CARPETA_DRIVE_ID_INVALIDO(
            "Por favor, ingresa un enlace o ID valido de la carpeta de Google Drive.", 400),
    CREDENCIALES_GOOGLE_NO_CONFIGURADAS(
            "Primero debes configurar las credenciales maestras de Google.", 400),
    CREDENCIALES_GOOGLE_NO_VERIFICADAS(
            "Como las credenciales de Google Cloud no estan verificadas, tampoco lo estaran en las"
                    + " plantillas de seguimiento. Verifica esa conexion antes de usar Drive o"
                    + " plantillas.",
            400),
    CARPETA_DRIVE_NO_ENCONTRADA(
            "No se encontro la carpeta en Google Drive. Verifica el enlace o los permisos de"
                    + " acceso.",
            404),
    ACCESO_DENEGADO_DRIVE(
            "Acceso denegado a la carpeta de Google Drive. Asegurate de que tu cuenta tenga"
                    + " permisos de lectura y que el scope de Drive este habilitado.",
            403),
    ERROR_CONSULTA_DRIVE("Error al consultar la carpeta en Google Drive.", 502),
    ERROR_CONEXION_DRIVE(
            "No se pudo conectar con Google Drive. Revisa tu conexion o credenciales.", 502),
    CARPETA_DRIVE_EN_PAPELERA(
            "La carpeta seleccionada se encuentra en la papelera de reciclaje de Google Drive.",
            400),
    ENLACE_DRIVE_NO_ES_CARPETA(
            "El enlace proporcionado no pertenece a una carpeta, sino a un archivo.", 400),
    ERROR_LISTAR_ARCHIVOS_DRIVE("Error al consultar archivos en la carpeta de Google Drive.", 502),
    NO_HAY_CREDENCIALES_GOOGLE("No hay credenciales de Google configuradas para verificar", 400),
    CREDENCIALES_GOOGLE_INCOMPLETAS(
            "Las credenciales de Google estan incompletas. Debes ingresar Client ID, Client Secret"
                    + " y Refresh Token.",
            400),
    GOOGLE_TOKEN_ACCESO_INVALIDO(
            "Google no devolvio un token de acceso valido. Revisa el Refresh Token.", 400),
    ERROR_CONEXION_GOOGLE(
            "Error al conectar con Google. Revisa tus credenciales maestras y la conexion de red.",
            502),
    GOOGLE_REFRESH_TOKEN_INVALIDO(
            "Error al conectar con Google: El Refresh Token es invalido, ha expirado o fue revocado"
                    + " en Google Cloud.",
            400),
    GOOGLE_CLIENT_ID_O_SECRET_INVALIDO(
            "Error al conectar con Google: El Client ID o Client Secret son incorrectos.", 400);

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
