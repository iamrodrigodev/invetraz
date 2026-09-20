package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import pe.edu.ulasalle.sistemainvestigacion.core.constants.ValidationConstants;

public record VerificarPasswordPeticion(
        @NotBlank(message = "La contrasena es obligatoria")
                @Size(
                        max = ValidationConstants.MAX_PASSWORD,
                        message = "La contrasena no puede exceder los {max} caracteres")
                String password) {}
