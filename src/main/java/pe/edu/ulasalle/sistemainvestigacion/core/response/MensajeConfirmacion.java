package pe.edu.ulasalle.sistemainvestigacion.core.response;

import lombok.Getter;

@Getter
public enum MensajeConfirmacion {
    OPERACION_EXITOSA("Operacion realizada exitosamente"),
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
