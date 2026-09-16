package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearTarea;

@Slf4j
@Service
public class CrearTareaImpl implements CasoUsoCrearTarea {

    private final TareaRepository tareaRepository;

    public CrearTareaImpl(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @Override
    public TareaRespuesta ejecutar(String idClase, CrearTareaPeticion peticion) {
        log.info("Creando tarea '{}' en clase '{}'", peticion.getTitulo(), idClase);

        TareaClassroom tareaDominio =
                TareaClassroom.builder()
                        .titulo(peticion.getTitulo())
                        .descripcion(peticion.getDescripcion())
                        .puntajeMaximo(peticion.getPuntajeMaximo())
                        .fechaLimite(peticion.getFechaLimite())
                        .estado(peticion.getEstado())
                        .build();

        TareaClassroom tareaGuardada = tareaRepository.guardar(idClase, tareaDominio);

        log.info(
                "Tarea '{}' creada exitosamente con id: '{}'",
                tareaGuardada.getTitulo(),
                tareaGuardada.getIdTarea());

        return TareaRespuesta.builder()
                .idTarea(tareaGuardada.getIdTarea())
                .idClase(tareaGuardada.getIdClase())
                .titulo(tareaGuardada.getTitulo())
                .descripcion(tareaGuardada.getDescripcion())
                .estado(tareaGuardada.getEstado())
                .enlaceTarea(tareaGuardada.getEnlaceTarea())
                .fechaLimite(tareaGuardada.getFechaLimite())
                .puntajeMaximo(tareaGuardada.getPuntajeMaximo())
                .build();
    }
}
