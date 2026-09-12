package pe.edu.ulasalle.sistemainvestigacion.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaseClassroom {
    private String idClassroom;
    private String nombre;
    private String seccion;
    private String profesorId;
    private EstadoClase estado;
    private String enlaceClase;
}
