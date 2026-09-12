package pe.edu.ulasalle.sistemainvestigacion.core.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

@Schema(description = "Estructura estándar de respuesta de error")
public record RespuestaErrorSwagger(
        @Schema(description = "Código de estado HTTP", example = "400") int estado,
        @Schema(
                        description = "Descripción legible del error",
                        example = "Datos de entrada inválidos")
                String mensaje,
        @Schema(
                        description = "Detalles adicionales del error",
                        example = "El correo ya se encuentra registrado")
                Object detalles,
        @Schema(
                        description = "Ruta del endpoint donde ocurrió",
                        example = "/api/autenticacion/login")
                String ruta,
        @Schema(description = "Fecha de la ocurrencia (YYYY-MM-DD)", example = "2026-09-01")
                String fecha,
        @Schema(description = "Hora de la ocurrencia (HH:mm:ss)", example = "10:00:00") String hora,
        @Schema(description = "Mapa de errores de validación de campos")
                Map<String, String> errores) {}
