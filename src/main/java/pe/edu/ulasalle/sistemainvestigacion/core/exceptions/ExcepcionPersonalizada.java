package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

import java.io.Serial;

public class ExcepcionPersonalizada extends RuntimeException {

    @Serial private static final long serialVersionUID = 1L;

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
