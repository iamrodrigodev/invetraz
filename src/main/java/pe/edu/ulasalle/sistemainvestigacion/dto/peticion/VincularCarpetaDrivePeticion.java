package pe.edu.ulasalle.sistemainvestigacion.dto.peticion;

import jakarta.validation.constraints.NotBlank;

public record VincularCarpetaDrivePeticion(
        @NotBlank(message = "El enlace o ID de la carpeta de Google Drive es obligatorio")
                String carpetaUrlOId) {}
