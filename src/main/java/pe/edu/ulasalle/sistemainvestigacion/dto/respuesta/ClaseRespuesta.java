package pe.edu.ulasalle.sistemainvestigacion.dto.respuesta;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClaseRespuesta {
    private String idClassroom;
    private String nombre;
    private String estado;
    private String enlaceClase;
}
