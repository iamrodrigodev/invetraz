package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import pe.edu.ulasalle.sistemainvestigacion.core.constants.ValidationConstants;

public record LoginPeticion(
        @NotBlank(message = "El correo es obligatorio")
                @Email(message = "El correo no tiene un formato valido")
                @Size(
                        max = ValidationConstants.MAX_EMAIL,
                        message = "El correo no puede exceder los {max} caracteres")
                String email,
        @NotBlank(message = "La contrasena es obligatoria")
                @Size(
                        max = ValidationConstants.MAX_PASSWORD,
                        message = "La contrasena no puede exceder los {max} caracteres")
                String password) {}
