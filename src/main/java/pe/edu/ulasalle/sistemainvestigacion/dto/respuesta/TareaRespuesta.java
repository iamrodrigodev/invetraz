package pe.edu.ulasalle.sistemainvestigacion.dto.respuesta;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;

@Data
@Builder
public class TareaRespuesta {
    private String idTarea;
    private String idClase;
    private String nombreClase;
    private String titulo;
    private String descripcion;
    private EstadoTarea estado;
    private String enlaceTarea;
    private LocalDateTime fechaLimite;
    private Double puntajeMaximo;
    private String idTema;
    private String nombreTema;
    private String idPlantilla;
    private String nombrePlantilla;
    private String enlacePlantilla;
    private LocalDateTime fechaCreacion;
}
