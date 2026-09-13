package pe.edu.ulasalle.sistemainvestigacion.repositories;

import java.util.List;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;

public interface TareaRepository {
    List<TareaClassroom> listarPorClase(String idClase);

    TareaClassroom guardar(String idClase, TareaClassroom tarea);
}
