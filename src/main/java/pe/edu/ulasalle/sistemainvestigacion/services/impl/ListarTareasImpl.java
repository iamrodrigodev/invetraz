package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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
        log.info("Consultando tareas de la clase '{}' en Google Classroom", idClase);
        List<TareaClassroom> tareas = tareaRepository.listarPorClase(idClase);
        log.info("Tareas obtenidas para la clase '{}': {}", idClase, tareas.size());

        if (tareas.isEmpty()) {
            return Collections.emptyList();
        }

        List<TareaRespuesta> resultado = new ArrayList<>(tareas.size());
        for (TareaClassroom tarea : tareas) {
            resultado.add(
                    TareaRespuesta.builder()
                            .idTarea(tarea.getIdTarea())
                            .idClase(tarea.getIdClase())
                            .titulo(tarea.getTitulo())
                            .descripcion(tarea.getDescripcion())
                            .estado(tarea.getEstado())
                            .enlaceTarea(tarea.getEnlaceTarea())
                            .fechaLimite(tarea.getFechaLimite())
                            .puntajeMaximo(tarea.getPuntajeMaximo())
                            .build());
        }
        return resultado;
    }
}
