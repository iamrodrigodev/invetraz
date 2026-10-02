package pe.edu.ulasalle.sistemainvestigacion.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.UsuarioDTO;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UsuarioMapper {
    UsuarioDTO toDto(Usuario entity);
}
