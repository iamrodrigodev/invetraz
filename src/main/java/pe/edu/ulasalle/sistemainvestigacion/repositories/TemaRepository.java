package pe.edu.ulasalle.sistemainvestigacion.repositories;

import java.util.List;
import pe.edu.ulasalle.sistemainvestigacion.models.TemaClassroom;

public interface TemaRepository {
    List<TemaClassroom> listarPorClase(String idClase);
}
