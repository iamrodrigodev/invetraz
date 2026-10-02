package pe.edu.ulasalle.sistemainvestigacion.mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.PlantillaXlsxDto;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.ActividadSeguimiento;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ActividadSeguimientoMapper {

    @Mapping(target = "idTarea", source = "idTareaClassroom")
    @Mapping(target = "idClase", source = "idClaseClassroom")
    @Mapping(target = "idTema", source = "idTemaClassroom")
    @Mapping(target = "idPlantilla", source = "idPlantillaDrive")
    TareaRespuesta toRespuesta(ActividadSeguimiento entity);

    List<TareaRespuesta> toRespuestaList(List<ActividadSeguimiento> entities);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "idTareaClassroom", source = "tareaGuardada.idTarea")
    @Mapping(target = "idClaseClassroom", source = "idClase")
    @Mapping(target = "nombreClase", source = "peticion.nombreClase")
    @Mapping(target = "idTemaClassroom", source = "peticion.idTema")
    @Mapping(target = "nombreTema", source = "peticion.nombreTema")
    @Mapping(target = "idPlantillaDrive", source = "peticion.idPlantilla")
    @Mapping(target = "nombrePlantilla", source = "peticion.nombrePlantilla")
    @Mapping(target = "enlacePlantilla", source = "peticion.enlacePlantilla")
    @Mapping(target = "titulo", source = "tareaGuardada.titulo")
    @Mapping(target = "descripcion", source = "tareaGuardada.descripcion")
    @Mapping(target = "fechaLimite", source = "tareaGuardada.fechaLimite")
    @Mapping(target = "puntajeMaximo", source = "tareaGuardada.puntajeMaximo")
    @Mapping(target = "estado", source = "tareaGuardada.estado")
    @Mapping(target = "enlaceTarea", source = "tareaGuardada.enlaceTarea")
    @Mapping(target = "fechaCreacion", source = "fechaCreacion")
    ActividadSeguimiento toEntity(
            UUID id,
            String idClase,
            TareaClassroom tareaGuardada,
            CrearTareaPeticion peticion,
            LocalDateTime fechaCreacion);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "idTareaClassroom", source = "remota.idTarea")
    @Mapping(target = "idClaseClassroom", source = "idClase")
    @Mapping(target = "nombreClase", source = "nombreClase")
    @Mapping(target = "idTemaClassroom", source = "remota.idTema")
    @Mapping(target = "nombreTema", ignore = true)
    @Mapping(target = "idPlantillaDrive", source = "plantilla.id")
    @Mapping(target = "nombrePlantilla", source = "plantilla.nombre")
    @Mapping(target = "enlacePlantilla", source = "plantilla.enlaceWeb")
    @Mapping(target = "titulo", source = "remota.titulo")
    @Mapping(target = "descripcion", source = "remota.descripcion")
    @Mapping(target = "fechaLimite", source = "remota.fechaLimite")
    @Mapping(target = "puntajeMaximo", source = "remota.puntajeMaximo")
    @Mapping(target = "estado", source = "remota.estado")
    @Mapping(target = "enlaceTarea", source = "remota.enlaceTarea")
    @Mapping(target = "fechaCreacion", source = "fechaCreacion")
    ActividadSeguimiento toEntityDesdeClassroom(
            UUID id,
            String idClase,
            String nombreClase,
            TareaClassroom remota,
            PlantillaXlsxDto plantilla,
            LocalDateTime fechaCreacion);
}
