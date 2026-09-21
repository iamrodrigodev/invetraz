package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import pe.edu.ulasalle.sistemainvestigacion.core.constants.ValidationConstants;

public record CambiarPasswordPeticion(
        @NotBlank(message = "La contrasena actual es obligatoria")
                @Size(
                        max = ValidationConstants.MAX_PASSWORD,
                        message = "La contraseña actual no puede exceder los {max} caracteres")
                String passwordActual,
        @NotBlank(message = "La contraseña nueva es obligatoria")
                @Size(
                        min = ValidationConstants.MIN_PASSWORD,
                        max = ValidationConstants.MAX_PASSWORD,
                        message = "La nueva contraseña debe tener entre {min} y {max} caracteres")
                @Pattern(
                        regexp = "^(?=.*[A-Z])(?=.*\\d).*$",
                        message =
                                "La nueva contraseña debe contener al menos una letra mayuscula y"
                                        + " un numero")
                String passwordNueva) {}
