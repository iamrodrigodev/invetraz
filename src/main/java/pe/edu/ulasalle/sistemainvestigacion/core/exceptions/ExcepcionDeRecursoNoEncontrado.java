package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

import java.io.Serial;

public class ExcepcionDeRecursoNoEncontrado extends ExcepcionPersonalizada {

    @Serial private static final long serialVersionUID = 1L;

    public ExcepcionDeRecursoNoEncontrado() {
        super(MensajesDeError.RECURSO_NO_ENCONTRADO);
    }

    public ExcepcionDeRecursoNoEncontrado(Object detalles) {
        super(MensajesDeError.RECURSO_NO_ENCONTRADO, detalles);
    }
}
