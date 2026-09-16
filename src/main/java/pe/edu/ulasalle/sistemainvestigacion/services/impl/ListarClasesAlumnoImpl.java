package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesAlumno;

@Slf4j
@Service
public class ListarClasesAlumnoImpl implements CasoUsoListarClasesAlumno {

    private final ClaseRepository claseRepository;

    public ListarClasesAlumnoImpl(ClaseRepository claseRepository) {
        this.claseRepository = claseRepository;
    }

    @Override
    public List<ClaseRespuesta> ejecutar() {
        log.info("Entrada - Solicitud para listar clases como alumno");
        log.info("Proceso - Consultando clases en Google Classroom donde el usuario es alumno...");
        List<ClaseClassroom> clases = claseRepository.listarPorAlumno();
        log.info("Resultado - Se obtuvieron {} clases como alumno", clases.size());

        return clases.stream()
                .map(
                        clase ->
                                ClaseRespuesta.builder()
                                        .idClassroom(clase.getIdClassroom())
                                        .nombre(clase.getNombre())
                                        .estado(clase.getEstado())
                                        .enlaceClase(clase.getEnlaceClase())
                                        .build())
                .collect(Collectors.toList());
    }
}
