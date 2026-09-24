package pe.edu.ulasalle.sistemainvestigacion.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearClasePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ClaseMapper {

    @Mapping(target = "idClassroom", ignore = true)
    @Mapping(target = "enlaceClase", ignore = true)
    @Mapping(target = "estado", constant = "PROVISIONED")
    ClaseClassroom toDominio(CrearClasePeticion peticion);

    ClaseRespuesta toRespuesta(ClaseClassroom clase);

    List<ClaseRespuesta> toRespuestaList(List<ClaseClassroom> clases);
}
