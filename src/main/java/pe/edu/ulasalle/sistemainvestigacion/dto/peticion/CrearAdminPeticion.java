package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearAdminPeticion(
        @NotBlank(message = "El correo es obligatorio")
                @Email(message = "El correo no tiene un formato valido")
                @Size(max = 150, message = "El correo no puede exceder los 150 caracteres")
                String email,
        @NotBlank(message = "La contrasena es obligatoria")
                @Size(
                        min = 8,
                        max = 255,
                        message = "La contrasena debe tener entre 8 y 255 caracteres")
                String password) {}
