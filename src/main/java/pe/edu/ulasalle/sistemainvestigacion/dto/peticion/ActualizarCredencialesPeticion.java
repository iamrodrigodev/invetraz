package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ActualizarCredencialesPeticion(
        @NotBlank @Size(max = 500) String googleClientId,
        @NotBlank @Size(max = 1000) String googleClientSecret,
        @NotBlank @Size(max = 1000) String googleRefreshToken) {}
