package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import lombok.Data;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;

@Data
public class CrearTareaPeticion {

    @NotBlank private String titulo;

    private String descripcion;

    private Double puntajeMaximo;

    private LocalDateTime fechaLimite;

    private EstadoTarea estado;
}
