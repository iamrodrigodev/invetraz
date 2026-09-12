package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CrearClasePeticion {

    @NotBlank private String nombre;

    @NotBlank private String seccion;

    @NotBlank private String profesorId;
}
