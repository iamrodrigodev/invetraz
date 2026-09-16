package pe.edu.ulasalle.sistemainvestigacion.repositories;

import java.util.List;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;

public interface ClaseRepository {
    ClaseClassroom guardar(ClaseClassroom clase);

    void archivar(String idClassroom);

    List<ClaseClassroom> listarPorDocente();

    List<ClaseClassroom> listarPorAlumno();
}
