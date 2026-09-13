package pe.edu.ulasalle.sistemainvestigacion.core.response;

public enum MensajeConfirmacion {
    OPERACION_EXITOSA("Operacion realizada exitosamente"),
    RECURSO_CREADO("Recurso creado exitosamente"),
    SISTEMA_OPERATIVO("El sistema de investigacion esta funcionando correctamente.");

    private final String mensaje;

    MensajeConfirmacion(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getMensaje() {
        return mensaje;
    }
}
