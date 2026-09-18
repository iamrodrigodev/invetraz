package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ActualizarCredencialesPeticion(
        @NotBlank(message = "El Client ID es obligatorio")
                @Size(max = 500, message = "El Client ID no puede exceder los 500 caracteres")
                String googleClientId,
        @NotBlank(message = "El Client Secret es obligatorio")
                @Size(max = 1000, message = "El Client Secret no puede exceder los 1000 caracteres")
                String googleClientSecret,
        @NotBlank(message = "El Refresh Token es obligatorio")
                @Size(max = 1000, message = "El Refresh Token no puede exceder los 1000 caracteres")
                String googleRefreshToken) {}
