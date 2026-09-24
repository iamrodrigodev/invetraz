package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.asincrono.ServicioTareasAsincrono;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearTarea;

@Slf4j
@Service
public class CrearTareaImpl implements CasoUsoCrearTarea {

    private final TareaRepository tareaRepository;
    private final ServicioTareasAsincrono servicioTareasAsincrono;

    public CrearTareaImpl(
            TareaRepository tareaRepository, ServicioTareasAsincrono servicioTareasAsincrono) {
        this.tareaRepository = tareaRepository;
        this.servicioTareasAsincrono = servicioTareasAsincrono;
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
                        .idTema(peticion.getIdTema())
                        .idPlantilla(peticion.getIdPlantilla())
                        .build();

        boolean esAsincrono = Boolean.TRUE.equals(peticion.getAsincrono());

        if (esAsincrono) {
            log.info(
                    "Despachando creacion de tarea '{}' de forma asincrona en clase '{}'",
                    peticion.getTitulo(),
                    idClase);
            servicioTareasAsincrono.ejecutarCreacionEnSegundoPlano(idClase, tareaDominio);

            return TareaRespuesta.builder()
                    .idTarea("async-" + System.currentTimeMillis())
                    .idClase(idClase)
                    .titulo(tareaDominio.getTitulo())
                    .descripcion(tareaDominio.getDescripcion())
                    .estado(
                            tareaDominio.getEstado() != null
                                    ? tareaDominio.getEstado()
                                    : EstadoTarea.PUBLISHED)
                    .fechaLimite(tareaDominio.getFechaLimite())
                    .puntajeMaximo(tareaDominio.getPuntajeMaximo())
                    .build();
        }

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
