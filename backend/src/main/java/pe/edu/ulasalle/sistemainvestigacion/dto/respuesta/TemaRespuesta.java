package pe.edu.ulasalle.sistemainvestigacion.dto.respuesta;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TemaRespuesta {
    private String idTema;
    private String idClase;
    private String nombre;
}
