package pe.edu.ulasalle.sistemainvestigacion.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.models.ActividadSeguimiento;

@Repository
public interface ActividadSeguimientoRepository extends JpaRepository<ActividadSeguimiento, UUID> {

    interface ConteoPlantilla {
        String getIdPlantillaDrive();

        Long getTotal();
    }

    List<ActividadSeguimiento> findAllByEstadoNotOrderByFechaCreacionDesc(EstadoTarea estado);

    Optional<ActividadSeguimiento> findByIdTareaClassroom(String idTareaClassroom);

    @Query(
            "SELECT a.idPlantillaDrive AS idPlantillaDrive, COUNT(a) AS total "
                    + "FROM ActividadSeguimiento a "
                    + "WHERE a.estado <> :estadoExcluido "
                    + "GROUP BY a.idPlantillaDrive")
    List<ConteoPlantilla> contarUsosPorPlantilla(
            @Param("estadoExcluido") EstadoTarea estadoExcluido);
}
