package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

public class ExcepcionDeNegocio extends ExcepcionPersonalizada {

    public ExcepcionDeNegocio(MensajesDeError mensajeError) {
        super(mensajeError);
    }

    public ExcepcionDeNegocio(String mensaje) {
        super(mensaje, 400);
    }

    public ExcepcionDeNegocio(String mensaje, int codigo) {
        super(mensaje, codigo);
    }
}
