package pe.edu.ulasalle.sistemainvestigacion.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TemaClassroom {
    private String idTema;
    private String idClase;
    private String nombre;
}
