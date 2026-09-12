package pe.edu.ulasalle.sistemainvestigacion.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaseClassroom {
    private String idClassroom;
    private String nombre;
    private String seccion;
    private String profesorId;
    private String estado;
    private String enlaceClase;
}
