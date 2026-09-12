package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

import lombok.Getter;

@Getter
public enum MensajesDeError {
    DATOS_INVALIDOS("Datos de entrada inválidos", 400),
    USUARIO_NO_ENCONTRADO("El usuario no existe", 404),
    USUARIO_NO_EXISTE("El usuario no existe", 404),
    CREDENCIALES_INVALIDAS("Credenciales incorrectas", 401),
    CUENTA_BLOQUEADA("Acceso restringido por seguridad", 403),
    EMAIL_DUPLICADO("El correo electrónico ya está registrado", 400),
    CORREO_YA_REGISTRADO("El correo electrónico ya está registrado", 400),
    ERROR_INTERNO("Error interno del servidor", 500),
    ACCESO_DENEGADO("Acceso denegado", 403),
    NO_AUTORIZADO("No autorizado", 401),
    RECURSO_NO_ENCONTRADO("Recurso no encontrado", 404),
    TOKEN_RECUPERACION_INVALIDO("Token de recuperación inválido o no existe", 400),
    TOKEN_RECUPERACION_USADO(
            "Este enlace de recuperación ya fue utilizado previamente para restablecer la"
                    + " contraseña.",
            400),
    TOKEN_RECUPERACION_EXPIRADO(
            "El enlace de recuperación ha expirado por seguridad (límite de 30 minutos).", 400),
    TOKEN_REFRESCO_INVALIDO("Token de refresco inválido o revocado", 401),
    TOKEN_REFRESCO_EXPIRADO(
            "El token de refresco ha expirado. Por favor inicia sesión nuevamente.", 401),
    TOKEN_INVALIDO("Token inválido o no encontrado", 400),
    TOKEN_EXPIRADO("El token ha expirado. Por favor solicita uno nuevo.", 400),
    ROL_NO_EXISTE("El rol indicado no existe", 400),
    PAGINACION_INVALIDA("La página debe ser mayor o igual a 1", 400),
    TAMANO_PAGINA_INVALIDO("El tamaño debe estar entre 1 y 100", 400),
    ESTADO_INVALIDO("El estado debe ser 0 o 1", 400),
    NO_PUEDE_AUTODESACTIVARSE("No puede desactivar su propio usuario", 400),
    DEMASIADOS_INTENTOS("Demasiados intentos. Intente nuevamente.", 429),
    DEMASIADAS_SOLICITUDES("Demasiadas solicitudes. Intente nuevamente.", 429),
    FALLO_AUTENTICACION("Fallo en la autenticación, intente nuevamente", 401),
    FALLO_LOGIN_GENERICO("Credenciales incorrectas o acceso denegado.", 401),
    USUARIO_INACTIVO("Usuario inactivo", 401),
    SIN_PERMISOS("Acceso denegado: no tiene los permisos necesarios", 403),
    SOLO_ADMIN_SAAS("Acceso denegado: Acción exclusiva para administradores del sistema.", 403),
    SOLO_EMPRESAS(
            "Las cuentas administrativas no pueden iniciar sesión desde el portal comercial. Por"
                    + " favor, usa el portal interno.",
            403),
    LOGIN_SOLO_ADMIN("Por favor, utiliza el portal de empresas para iniciar sesión.", 403),
    RECUPERACION_SOLO_EMPRESAS(
            "Las cuentas administrativas no pueden recuperar su contraseña desde el portal"
                    + " comercial. Por favor, usa el portal interno.",
            403),
    RECUPERACION_SOLO_ADMIN(
            "Por favor, utiliza el portal de empresas para recuperar tu contraseña.", 403),
    RECURSO_AJENO("Acceso denegado: no puede acceder a recursos de otro usuario", 403),
    JWT_CLAVE_MUY_CORTA("La clave JWT debe tener al menos 32 caracteres.", 500),
    CORS_ORIGEN_INVALIDO(
            "app.cors.credenciales no puede ser true si app.cors.origenes incluye '*'.", 500),
    EMPRESA_DUPLICADA("El subdominio o RUC ya se encuentra registrado.", 400),
    EMPRESA_NO_ENCONTRADA("Empresa no encontrada.", 404),
    EMPRESA_INACTIVA("Esta empresa se encuentra inactiva.", 403),
    EMPRESA_SUSPENDIDA(
            "Esta empresa se encuentra temporalmente suspendida. Por favor, comuníquese con el"
                    + " administrador.",
            403),
    TIPO_EMPRESA_NO_ENCONTRADO("Tipo de empresa no encontrado.", 404),
    RUC_OBLIGATORIO_FORMAL("Las empresas formales requieren un RUC válido obligatorio.", 400),
    RAZON_SOCIAL_OBLIGATORIA_FORMAL("La razón social es obligatoria para empresas formales.", 400),
    REPOSITORIO_EMPRESA_NO_INYECTADO("Repositorio de empresa no inyectado en el servicio.", 500),
    CLAVE_ACTUAL_INCORRECTA("La contraseña actual es incorrecta.", 400),
    CLAVE_IGUAL_A_ANTERIOR("La nueva contraseña no puede ser igual a la anterior.", 400),
    SUCURSAL_NO_ENCONTRADA("La sucursal solicitada no existe o no pertenece a esta empresa.", 404),
    DISTRITO_INVALIDO("El distrito seleccionado no es válido.", 400),
    UBICACION_INCONSISTENTE(
            "La provincia o departamento no coinciden con el distrito seleccionado.", 400),
    PLAN_NO_ENCONTRADO("El plan comercial solicitado no existe.", 404),
    PLAN_CODIGO_DUPLICADO("El código de plan ya se encuentra registrado.", 400),
    SUSCRIPCION_NO_ENCONTRADA("La suscripción solicitada no existe.", 404),
    SUSCRIPCION_EMPRESA_DUPLICADA("La empresa ya cuenta con una suscripción registrada.", 400),
    PLAN_NO_PERMITE_ROLES_PERSONALIZADOS(
            "La creación de roles personalizados requiere un plan Premium o superior.", 403),
    LIMITE_ROLES_PERSONALIZADOS_EXCEDIDO(
            "Ha alcanzado el límite de roles personalizados permitidos por su plan actual.", 403),
    LIMITE_CANCHAS_EXCEDIDO(
            "Ha alcanzado el límite de canchas permitidas por su plan actual.", 403),
    LIMITE_CANCHAS_POR_SUCURSAL_EXCEDIDO(
            "Ha alcanzado el límite de canchas permitidas para esta sucursal.", 403),
    LIMITE_SUCURSALES_EXCEDIDO(
            "Ha alcanzado el límite de sucursales permitidas por su plan actual.", 403),
    LIMITE_STAFF_EXCEDIDO("Ha alcanzado el límite de personal permitido por su plan actual.", 403),
    CLIENTE_NO_ENCONTRADO("El cliente solicitado no existe o no pertenece a esta empresa.", 404),
    CANCHA_NO_ENCONTRADA("La cancha solicitada no existe o no pertenece a esta empresa.", 404),
    CANCHA_NOMBRE_DUPLICADO("Ya existe una cancha activa con ese nombre en esta empresa.", 400),
    MODALIDAD_NO_ENCONTRADA("La modalidad indicada no existe o está inactiva.", 404),
    SUPERFICIE_NO_ENCONTRADA("La superficie indicada no existe o está inactiva.", 404),
    SUCURSAL_INACTIVA("No se puede operar sobre una sucursal inactiva o suspendida.", 403),
    ROL_NOMBRE_DUPLICADO_EMPRESA("Ya existe un rol con ese nombre registrado en su empresa.", 400),
    ROL_ES_SISTEMA("Los roles base del sistema no pueden ser modificados ni eliminados.", 400),
    PERMISO_NO_ENCONTRADO("Uno o más permisos especificados no existen.", 404),
    PERMISO_NO_PERMITIDO_TENANT(
            "No tiene autorización para asignar permisos exclusivos de plataforma SaaS.", 403),
    LIMITES_PLAN_INVALIDOS("Limites del plan invalidos", 403),
    LIMITES_PLAN_INCOMPLETOS("Limites del plan invalidos o incompletos", 400),
    PERIODO_FACTURACION_INVALIDO("Periodo de facturación inválido", 400),
    NOMBRE_ROL_OBLIGATORIO("El nombre del rol es obligatorio", 400),
    ESTADO_ROL_INVALIDO("Estado de rol invalido", 400),
    ESTADO_SUSCRIPCION_INVALIDO("Estado de suscripcion invalido", 400),
    ROL_SISTEMA_NO_MODIFICABLE("No se pueden modificar roles del sistema", 400),
    ROL_SISTEMA_NO_ELIMINABLE("No se pueden eliminar roles del sistema", 400),
    METODO_NO_PERMITIDO("Método no permitido para este endpoint", 405),
    ERROR_GENERAL("Ocurrió un error al procesar la solicitud.", 500);

    private final String mensaje;
    private final int codigo;

    MensajesDeError(String mensaje, int codigo) {
        this.mensaje = mensaje;
        this.codigo = codigo;
    }
}


