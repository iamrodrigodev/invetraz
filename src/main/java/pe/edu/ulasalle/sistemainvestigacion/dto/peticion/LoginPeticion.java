package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginPeticion(
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(max = 255) String password) {}
