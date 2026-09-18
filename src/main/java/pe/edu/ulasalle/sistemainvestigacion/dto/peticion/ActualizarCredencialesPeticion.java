package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import pe.edu.ulasalle.sistemainvestigacion.core.constants.ValidationConstants;

public record ActualizarCredencialesPeticion(
        @NotBlank(message = "El Client ID es obligatorio")
                @Size(
                        max = ValidationConstants.MAX_GOOGLE_CLIENT_ID,
                        message = "El Client ID no puede exceder los {max} caracteres")
                String googleClientId,
        @NotBlank(message = "El Client Secret es obligatorio")
                @Size(
                        max = ValidationConstants.MAX_GOOGLE_CLIENT_SECRET,
                        message = "El Client Secret no puede exceder los {max} caracteres")
                String googleClientSecret,
        @NotBlank(message = "El Refresh Token es obligatorio")
                @Size(
                        max = ValidationConstants.MAX_GOOGLE_REFRESH_TOKEN,
                        message = "El Refresh Token no puede exceder los {max} caracteres")
                String googleRefreshToken) {}
