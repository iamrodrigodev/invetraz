package pe.edu.ulasalle.sistemainvestigacion.services;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.CacheClassroom;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.CarpetaPlantillasRespuestaDto;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.PlantillaXlsxDto;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.mapper.ActividadSeguimientoMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.ActividadSeguimiento;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ActividadSeguimientoRepository;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;

@Slf4j
@Service
public class ServicioActividadesSeguimiento {

    private final ActividadSeguimientoRepository actividadRepository;
    private final TareaRepository tareaRepository;
    private final ClaseRepository claseRepository;
    private final ServicioDrivePlantillas servicioDrivePlantillas;
    private final CacheClassroom cacheClassroom;
    private final ActividadSeguimientoMapper actividadSeguimientoMapper;

    public ServicioActividadesSeguimiento(
            ActividadSeguimientoRepository actividadRepository,
            TareaRepository tareaRepository,
            ClaseRepository claseRepository,
            ServicioDrivePlantillas servicioDrivePlantillas,
            CacheClassroom cacheClassroom,
            ActividadSeguimientoMapper actividadSeguimientoMapper) {
        this.actividadRepository = actividadRepository;
        this.tareaRepository = tareaRepository;
        this.claseRepository = claseRepository;
        this.servicioDrivePlantillas = servicioDrivePlantillas;
        this.cacheClassroom = cacheClassroom;
        this.actividadSeguimientoMapper = actividadSeguimientoMapper;
    }

    @Transactional(readOnly = true)
    public List<TareaRespuesta> listarActividades() {
        List<ActividadSeguimiento> actividades =
                actividadRepository.findAllByEstadoNotOrderByFechaCreacionDesc(EstadoTarea.DELETED);
        if (actividades.isEmpty()) {
            return Collections.emptyList();
        }
        return actividadSeguimientoMapper.toRespuestaList(actividades);
    }

    @Transactional
    public List<TareaRespuesta> sincronizarConClassroom() {
        List<ActividadSeguimiento> registradas =
                actividadRepository.findAllByEstadoNotOrderByFechaCreacionDesc(EstadoTarea.DELETED);

        Map<String, PlantillaXlsxDto> mapaPlantillas = obtenerMapaPlantillasConfiguradas();
        Map<String, String> nombresClases = new HashMap<>();
        Set<String> idsClasesAConsultar = new HashSet<>();

        for (ActividadSeguimiento act : registradas) {
            idsClasesAConsultar.add(act.getIdClaseClassroom());
            if (act.getNombreClase() != null) {
                nombresClases.put(act.getIdClaseClassroom(), act.getNombreClase());
            }
        }

        if (!mapaPlantillas.isEmpty()) {
            try {
                List<ClaseClassroom> clasesDocente = claseRepository.listarPorDocente();
                for (ClaseClassroom c : clasesDocente) {
                    if (c.getIdClassroom() != null) {
                        idsClasesAConsultar.add(c.getIdClassroom());
                        nombresClases.put(c.getIdClassroom(), c.getNombre());
                    }
                }
            } catch (Exception e) {
                log.warn(
                        "No se pudieron listar clases del docente durante la sincronización: {}",
                        e.getMessage());
            }
        }

        Map<String, Map<String, TareaClassroom>> tareasPorClase = new HashMap<>();
        for (String idClase : idsClasesAConsultar) {
            try {
                cacheClassroom.invalidarTareas(idClase);
                List<TareaClassroom> tareas = tareaRepository.listarPorClase(idClase);
                Map<String, TareaClassroom> mapaTareas = new HashMap<>();
                for (TareaClassroom t : tareas) {
                    if (t.getIdTarea() != null) {
                        mapaTareas.put(t.getIdTarea(), t);
                    }
                }
                tareasPorClase.put(idClase, mapaTareas);
            } catch (Exception e) {
                log.warn(
                        "No se pudieron sincronizar tareas de la clase '{}': {}",
                        idClase,
                        e.getMessage());
            }
        }

        Set<String> idsTareasProcesadas = new HashSet<>();
        for (ActividadSeguimiento act : registradas) {
            idsTareasProcesadas.add(act.getIdTareaClassroom());
            Map<String, TareaClassroom> tareasDeClase =
                    tareasPorClase.get(act.getIdClaseClassroom());
            if (tareasDeClase == null) {
                continue;
            }

            TareaClassroom remota = tareasDeClase.get(act.getIdTareaClassroom());
            if (remota == null || remota.getEstado() == EstadoTarea.DELETED) {
                act.setEstado(EstadoTarea.DELETED);
                actividadRepository.save(act);
                continue;
            }

            act.setTitulo(remota.getTitulo());
            act.setDescripcion(remota.getDescripcion());
            act.setFechaLimite(remota.getFechaLimite());
            act.setPuntajeMaximo(remota.getPuntajeMaximo());
            act.setEstado(remota.getEstado() != null ? remota.getEstado() : EstadoTarea.PUBLISHED);
            if (remota.getEnlaceTarea() != null) {
                act.setEnlaceTarea(remota.getEnlaceTarea());
            }
            if (remota.getIdTema() != null) {
                act.setIdTemaClassroom(remota.getIdTema());
            }
            if (act.getNombreClase() == null
                    && nombresClases.containsKey(act.getIdClaseClassroom())) {
                act.setNombreClase(nombresClases.get(act.getIdClaseClassroom()));
            }
            PlantillaXlsxDto infoPlantilla = mapaPlantillas.get(act.getIdPlantillaDrive());
            if (infoPlantilla != null) {
                if (act.getNombrePlantilla() == null) {
                    act.setNombrePlantilla(infoPlantilla.nombre());
                }
                if (act.getEnlacePlantilla() == null) {
                    act.setEnlacePlantilla(infoPlantilla.enlaceWeb());
                }
            }
            actividadRepository.save(act);
        }

        if (!mapaPlantillas.isEmpty()) {
            for (Map.Entry<String, Map<String, TareaClassroom>> entry : tareasPorClase.entrySet()) {
                String idClase = entry.getKey();
                for (TareaClassroom remota : entry.getValue().values()) {
                    if (remota.getIdTarea() == null
                            || idsTareasProcesadas.contains(remota.getIdTarea())
                            || remota.getEstado() == EstadoTarea.DELETED) {
                        continue;
                    }
                    String idPlantilla = remota.getIdPlantilla();
                    if (idPlantilla != null && mapaPlantillas.containsKey(idPlantilla)) {
                        PlantillaXlsxDto plantilla = mapaPlantillas.get(idPlantilla);
                        ActividadSeguimiento existente =
                                actividadRepository
                                        .findByIdTareaClassroom(remota.getIdTarea())
                                        .orElse(null);
                        if (existente == null) {
                            ActividadSeguimiento nueva =
                                    actividadSeguimientoMapper.toEntityDesdeClassroom(
                                            UUID.randomUUID(),
                                            idClase,
                                            nombresClases.get(idClase),
                                            remota,
                                            plantilla,
                                            LocalDateTime.now());
                            if (nueva.getEstado() == null) {
                                nueva.setEstado(EstadoTarea.PUBLISHED);
                            }
                            actividadRepository.save(nueva);
                            idsTareasProcesadas.add(remota.getIdTarea());
                        }
                    }
                }
            }
        }

        return listarActividades();
    }

    private Map<String, PlantillaXlsxDto> obtenerMapaPlantillasConfiguradas() {
        try {
            CarpetaPlantillasRespuestaDto carpeta =
                    servicioDrivePlantillas.obtenerPlantillasConfiguradas();
            if (carpeta == null || carpeta.plantillas() == null || carpeta.plantillas().isEmpty()) {
                return Collections.emptyMap();
            }
            Map<String, PlantillaXlsxDto> mapa = new HashMap<>(carpeta.plantillas().size());
            for (PlantillaXlsxDto p : carpeta.plantillas()) {
                if (p.id() != null) {
                    mapa.put(p.id(), p);
                }
            }
            return mapa;
        } catch (Exception e) {
            log.warn("No se pudieron consultar plantillas para sincronización: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }
}
