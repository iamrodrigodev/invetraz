package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;

public record ActualizarCredencialesPeticion(
        @NotBlank String googleClientId,
        @NotBlank String googleClientSecret,
        @NotBlank String googleRefreshToken) {}
