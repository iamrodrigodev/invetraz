package pe.edu.ulasalle.sistemainvestigacion.models;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;

@Data
@Builder
public class TareaClassroom {
    private String idTarea;
    private String idClase;
    private String titulo;
    private String descripcion;
    private EstadoTarea estado;
    private String enlaceTarea;
    private LocalDateTime fechaLimite;
    private Double puntajeMaximo;
}
