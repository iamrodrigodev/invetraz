package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

import java.io.Serial;

public class ExcepcionDeNegocio extends ExcepcionPersonalizada {

    @Serial private static final long serialVersionUID = 1L;

    public ExcepcionDeNegocio(MensajesDeError mensajeError) {
        super(mensajeError);
    }

    public ExcepcionDeNegocio(MensajesDeError mensajeError, Object detalles) {
        super(mensajeError, detalles);
    }

    public ExcepcionDeNegocio(String mensaje, int codigo) {
        super(mensaje, codigo);
    }

    public ExcepcionDeNegocio(String mensaje, int codigo, Object detalles) {
        super(mensaje, codigo, detalles);
    }
}
