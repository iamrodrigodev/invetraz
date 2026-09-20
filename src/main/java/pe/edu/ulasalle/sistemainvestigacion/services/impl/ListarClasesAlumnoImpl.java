package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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
        log.info("Consultando clases del estudiante en Google Classroom");
        List<ClaseClassroom> clases = claseRepository.listarPorAlumno();
        log.info("Clases de estudiante obtenidas: {}", clases.size());

        if (clases.isEmpty()) {
            return Collections.emptyList();
        }

        List<ClaseRespuesta> resultado = new ArrayList<>(clases.size());
        for (ClaseClassroom clase : clases) {
            resultado.add(
                    ClaseRespuesta.builder()
                            .idClassroom(clase.getIdClassroom())
                            .nombre(clase.getNombre())
                            .estado(clase.getEstado())
                            .enlaceClase(clase.getEnlaceClase())
                            .build());
        }
        return resultado;
    }
}
