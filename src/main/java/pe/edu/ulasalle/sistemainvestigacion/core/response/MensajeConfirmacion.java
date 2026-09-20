package pe.edu.ulasalle.sistemainvestigacion.core.response;

public enum MensajeConfirmacion {
    OPERACION_EXITOSA("Operacion realizada exitosamente", 200),
    RECURSO_CREADO("Recurso creado exitosamente", 201),
    SISTEMA_OPERATIVO("El sistema de investigacion esta funcionando correctamente.", 200);

    private final String mensaje;
    private final int codigo;

    MensajeConfirmacion(String mensaje, int codigo) {
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
