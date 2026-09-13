package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

public class ExcepcionDeRecursoNoEncontrado extends ExcepcionPersonalizada {

    public ExcepcionDeRecursoNoEncontrado() {
        super(MensajesDeError.RECURSO_NO_ENCONTRADO);
    }
}
