package pe.edu.ulasalle.sistemainvestigacion.core.responses;

import lombok.Getter;

@Getter
public enum MensajeConfirmacion {
    OPERACION_EXITOSA("Operación realizada exitosamente"),
    LOGIN_EXITOSO("Inicio de sesión exitoso"),
    REGISTRO_EXITOSO("Registro realizado exitosamente"),
    ACTUALIZACION_EXITOSA("Actualización realizada exitosamente"),
    CUENTA_REGISTRADA("Cuenta registrada exitosamente"),
    DATOS_OBTENIDOS("Datos obtenidos exitosamente"),
    SESION_CERRADA("Sesión cerrada exitosamente"),
    LOGOUT_EXITOSO("Sesión cerrada exitosamente"),
    TOKEN_REFRESCADO("Token de acceso renovado exitosamente"),
    SISTEMA_EN_LINEA("Sistema en línea y funcionando"),
    ENLACE_RECUPERACION_ENVIADO("Enlace de recuperación enviado exitosamente"),
    CORREO_RECUPERACION_ENVIADO("Enlace de recuperación enviado exitosamente"),
    CLAVE_RESTABLECIDA("Clave restablecida exitosamente"),
    USUARIO_CREADO("Usuario creado correctamente"),
    USUARIO_ACTUALIZADO("Usuario actualizado correctamente"),
    ESTADO_ACTUALIZADO("Estado actualizado correctamente"),
    USUARIO_DESACTIVADO("Usuario desactivado correctamente"),
    ACTUALIZADO_EXITOSAMENTE("Actualizado exitosamente"),
    RECURSO_CREADO("Recurso creado exitosamente"),
    RECURSO_ACTUALIZADO("Recurso actualizado exitosamente"),
    RECURSO_OBTENIDO("Recurso devuelto exitosamente"),
    RECURSOS_OBTENIDOS("Recursos devueltos exitosamente"),
    RECURSO_ELIMINADO("Recurso eliminado exitosamente");

    private final String mensaje;

    MensajeConfirmacion(String mensaje) {
        this.mensaje = mensaje;
    }
}
