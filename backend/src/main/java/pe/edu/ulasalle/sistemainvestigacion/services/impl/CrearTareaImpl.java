package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.mapper.ActividadSeguimientoMapper;
import pe.edu.ulasalle.sistemainvestigacion.mapper.TareaMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.ActividadSeguimiento;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ActividadSeguimientoRepository;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearTarea;

@Slf4j
@Service
public class CrearTareaImpl implements CasoUsoCrearTarea {

    private final TareaRepository tareaRepository;
    private final ActividadSeguimientoRepository actividadSeguimientoRepository;
    private final TareaMapper tareaMapper;
    private final ActividadSeguimientoMapper actividadSeguimientoMapper;

    public CrearTareaImpl(
            TareaRepository tareaRepository,
            ActividadSeguimientoRepository actividadSeguimientoRepository,
            TareaMapper tareaMapper,
            ActividadSeguimientoMapper actividadSeguimientoMapper) {
        this.tareaRepository = tareaRepository;
        this.actividadSeguimientoRepository = actividadSeguimientoRepository;
        this.tareaMapper = tareaMapper;
        this.actividadSeguimientoMapper = actividadSeguimientoMapper;
    }

    @Override
    @Transactional
    public TareaRespuesta ejecutar(String idClase, CrearTareaPeticion peticion) {
        log.info("Creando tarea '{}' en clase '{}'", peticion.getTitulo(), idClase);

        TareaClassroom tareaDominio = tareaMapper.toDominio(peticion);

        TareaClassroom tareaGuardada = tareaRepository.guardar(idClase, tareaDominio);
        LocalDateTime fechaCreacion = LocalDateTime.now();

        if (actividadSeguimientoRepository != null
                && peticion.getIdPlantilla() != null
                && !peticion.getIdPlantilla().isBlank()) {
            ActividadSeguimiento actividad =
                    actividadSeguimientoMapper.toEntity(
                            UUID.randomUUID(), idClase, tareaGuardada, peticion, fechaCreacion);
            actividadSeguimientoRepository.save(actividad);
        }

        log.info(
                "Tarea '{}' creada exitosamente con id: '{}'",
                tareaGuardada.getTitulo(),
                tareaGuardada.getIdTarea());

        return tareaMapper.toRespuestaCreada(tareaGuardada, peticion, fechaCreacion);
    }
}
