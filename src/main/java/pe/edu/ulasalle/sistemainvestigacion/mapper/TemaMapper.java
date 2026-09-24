package pe.edu.ulasalle.sistemainvestigacion.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TemaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.TemaClassroom;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TemaMapper {

    TemaRespuesta toRespuesta(TemaClassroom tema);

    List<TemaRespuesta> toRespuestaList(List<TemaClassroom> temas);
}
