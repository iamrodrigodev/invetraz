package pe.edu.ulasalle.sistemainvestigacion.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ConfiguracionSistemaDTO;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ConfiguracionSistemaMapper {
    ConfiguracionSistemaDTO toDto(ConfiguracionSistema entity);
}
