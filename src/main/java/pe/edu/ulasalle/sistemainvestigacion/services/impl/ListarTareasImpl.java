package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.mapper.TareaMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTareas;

@Slf4j
@Service
public class ListarTareasImpl implements CasoUsoListarTareas {

    private final TareaRepository tareaRepository;
    private final TareaMapper tareaMapper;

    public ListarTareasImpl(TareaRepository tareaRepository, TareaMapper tareaMapper) {
        this.tareaRepository = tareaRepository;
        this.tareaMapper = tareaMapper;
    }

    @Override
    public List<TareaRespuesta> ejecutar(String idClase) {
        log.info("Consultando tareas de la clase '{}' en Google Classroom", idClase);
        List<TareaClassroom> tareas = tareaRepository.listarPorClase(idClase);
        log.info("Tareas obtenidas para la clase '{}': {}", idClase, tareas.size());

        if (tareas.isEmpty()) {
            return Collections.emptyList();
        }

        return tareaMapper.toRespuestaList(tareas);
    }
}
