package pe.edu.ulasalle.sistemainvestigacion.dto.respuesta;

import java.util.List;
import lombok.Builder;

@Builder
public record CarpetaPlantillasRespuestaDto(
        boolean carpetaConfigurada,
        String carpetaId,
        String carpetaNombre,
        List<PlantillaXlsxDto> plantillas,
        Boolean driveVerificado) {}
