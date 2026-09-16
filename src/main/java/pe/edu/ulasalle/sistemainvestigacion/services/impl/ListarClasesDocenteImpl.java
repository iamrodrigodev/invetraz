package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesDocente;

@Slf4j
@Service
public class ListarClasesDocenteImpl implements CasoUsoListarClasesDocente {

    private final ClaseRepository claseRepository;

    public ListarClasesDocenteImpl(ClaseRepository claseRepository) {
        this.claseRepository = claseRepository;
    }

    @Override
    public List<ClaseRespuesta> ejecutar() {
        log.info("Consultando clases del docente en Google Classroom");
        List<ClaseClassroom> clases = claseRepository.listarPorDocente();
        log.info("Clases de docente obtenidas: {}", clases.size());

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
