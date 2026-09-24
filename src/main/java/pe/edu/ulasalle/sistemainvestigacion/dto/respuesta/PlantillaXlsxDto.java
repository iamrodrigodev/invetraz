package pe.edu.ulasalle.sistemainvestigacion.dto.respuesta;

import lombok.Builder;

@Builder
public record PlantillaXlsxDto(
        String id,
        String nombre,
        String tipoMime,
        String enlaceWeb,
        String enlaceDescarga,
        Long tamanoBytes,
        String ultimaModificacion,
        Long frecuenciaUso) {}
