package pe.edu.ulasalle.sistemainvestigacion.dto.respuesta;

public record VerificarAutenticacionRespuesta(boolean autenticado, String email) {
    public VerificarAutenticacionRespuesta(boolean autenticado) {
        this(autenticado, null);
    }
}
