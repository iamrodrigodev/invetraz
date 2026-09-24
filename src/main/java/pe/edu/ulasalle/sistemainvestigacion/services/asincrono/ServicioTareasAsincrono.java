package pe.edu.ulasalle.sistemainvestigacion.services.asincrono;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;

@Slf4j
@Service
public class ServicioTareasAsincrono {

    private final TareaRepository tareaRepository;

    public ServicioTareasAsincrono(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @Async("ejecutorTareasClassroom")
    public void ejecutarCreacionEnSegundoPlano(String idClase, TareaClassroom tareaDominio) {
        long inicio = System.currentTimeMillis();
        try {
            log.info(
                    "[Async] Iniciando creacion de tarea '{}' en clase '{}'",
                    tareaDominio.getTitulo(),
                    idClase);
            TareaClassroom guardada = tareaRepository.guardar(idClase, tareaDominio);
            log.info(
                    "[Async] Tarea '{}' creada exitosamente en Google Classroom con id '{}' en {}"
                            + " ms",
                    guardada.getTitulo(),
                    guardada.getIdTarea(),
                    System.currentTimeMillis() - inicio);
        } catch (Exception e) {
            log.error(
                    "[Async] Error al crear tarea '{}' en clase '{}': {}",
                    tareaDominio.getTitulo(),
                    idClase,
                    e.getMessage(),
                    e);
        }
    }
}
