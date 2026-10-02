package pe.edu.ulasalle.sistemainvestigacion.mapper;

import java.time.LocalDateTime;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TareaMapper {

    @Mapping(target = "idTarea", ignore = true)
    @Mapping(target = "idClase", ignore = true)
    @Mapping(target = "enlaceTarea", ignore = true)
    TareaClassroom toDominio(CrearTareaPeticion peticion);

    @Mapping(target = "nombreClase", ignore = true)
    @Mapping(target = "nombreTema", ignore = true)
    @Mapping(target = "nombrePlantilla", ignore = true)
    @Mapping(target = "enlacePlantilla", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    TareaRespuesta toRespuesta(TareaClassroom tarea);

    List<TareaRespuesta> toRespuestaList(List<TareaClassroom> tareas);

    @Mapping(target = "idTarea", source = "tareaGuardada.idTarea")
    @Mapping(target = "idClase", source = "tareaGuardada.idClase")
    @Mapping(target = "nombreClase", source = "peticion.nombreClase")
    @Mapping(target = "titulo", source = "tareaGuardada.titulo")
    @Mapping(target = "descripcion", source = "tareaGuardada.descripcion")
    @Mapping(target = "estado", source = "tareaGuardada.estado")
    @Mapping(target = "enlaceTarea", source = "tareaGuardada.enlaceTarea")
    @Mapping(target = "fechaLimite", source = "tareaGuardada.fechaLimite")
    @Mapping(target = "puntajeMaximo", source = "tareaGuardada.puntajeMaximo")
    @Mapping(target = "idTema", source = "peticion.idTema")
    @Mapping(target = "nombreTema", source = "peticion.nombreTema")
    @Mapping(target = "idPlantilla", source = "peticion.idPlantilla")
    @Mapping(target = "nombrePlantilla", source = "peticion.nombrePlantilla")
    @Mapping(target = "enlacePlantilla", source = "peticion.enlacePlantilla")
    @Mapping(target = "fechaCreacion", source = "fechaCreacion")
    TareaRespuesta toRespuestaCreada(
            TareaClassroom tareaGuardada, CrearTareaPeticion peticion, LocalDateTime fechaCreacion);
}
