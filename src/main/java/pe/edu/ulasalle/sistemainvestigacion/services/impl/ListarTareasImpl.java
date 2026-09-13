package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTareas;

@Slf4j
@Service
public class ListarTareasImpl implements CasoUsoListarTareas {

    private final TareaRepository tareaRepository;

    public ListarTareasImpl(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @Override
    public List<TareaRespuesta> ejecutar(String idClase) {
        log.info("Entrada - Listando tareas para la clase con id: '{}'", idClase);
        log.info("Proceso - Consultando tareas en Google Classroom para la clase '{}'...", idClase);
        List<TareaClassroom> tareas = tareaRepository.listarPorClase(idClase);
        log.info("Resultado - Se obtuvieron {} tareas para la clase '{}'", tareas.size(), idClase);

        return tareas.stream()
                .map(
                        tarea ->
                                TareaRespuesta.builder()
                                        .idTarea(tarea.getIdTarea())
                                        .idClase(tarea.getIdClase())
                                        .titulo(tarea.getTitulo())
                                        .descripcion(tarea.getDescripcion())
                                        .estado(tarea.getEstado())
                                        .enlaceTarea(tarea.getEnlaceTarea())
                                        .fechaLimite(tarea.getFechaLimite())
                                        .puntajeMaximo(tarea.getPuntajeMaximo())
                                        .build())
                .collect(Collectors.toList());
    }
}
