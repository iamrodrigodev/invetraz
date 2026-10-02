package pe.edu.ulasalle.sistemainvestigacion.models;

import lombok.Builder;
import lombok.Data;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;

@Data
@Builder
public class ClaseClassroom {
    private String idClassroom;
    private String nombre;
    private String seccion;
    private String profesorId;
    private EstadoClase estado;
    private String enlaceClase;
}
