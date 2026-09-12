package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

import java.io.Serial;
import lombok.Getter;

@Getter
public class ExcepcionPersonalizada extends RuntimeException {

    @Serial private static final long serialVersionUID = 1L;

    private final MensajesDeError mensajeError;
    private final int codigo;
    private final Object detalles;

    public ExcepcionPersonalizada(MensajesDeError mensajeError) {
        super(mensajeError.getMensaje());
        this.mensajeError = mensajeError;
        this.codigo = mensajeError.getCodigo();
        this.detalles = null;
    }

    public ExcepcionPersonalizada(MensajesDeError mensajeError, Object detalles) {
        super(mensajeError.getMensaje());
        this.mensajeError = mensajeError;
        this.codigo = mensajeError.getCodigo();
        this.detalles = detalles;
    }

    public ExcepcionPersonalizada(String mensaje, int codigo) {
        super(mensaje);
        this.mensajeError = null;
        this.codigo = codigo;
        this.detalles = null;
    }

    public ExcepcionPersonalizada(String mensaje, int codigo, Object detalles) {
        super(mensaje);
        this.mensajeError = null;
        this.codigo = codigo;
        this.detalles = detalles;
    }
}
