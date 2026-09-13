package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

public class ExcepcionPersonalizada extends RuntimeException {

    private final MensajesDeError mensajeError;
    private final int codigo;

    public ExcepcionPersonalizada(MensajesDeError mensajeError) {
        super(mensajeError.getMensaje());
        this.mensajeError = mensajeError;
        this.codigo = mensajeError.getCodigo();
    }

    public ExcepcionPersonalizada(String mensaje, int codigo) {
        super(mensaje);
        this.mensajeError = null;
        this.codigo = codigo;
    }

    public MensajesDeError getMensajeError() {
        return mensajeError;
    }

    public int getCodigo() {
        return codigo;
    }
}
