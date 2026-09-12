package pe.edu.ulasalle.sistemainvestigacion.repositories;

import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;

public interface ClaseRepository {
    ClaseClassroom guardar(ClaseClassroom clase);

    void archivar(String idClassroom);
}
