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
        log.info("Entrada - Solicitud para listar clases de docente");
        log.info("Proceso - Consultando clases en Google Classroom donde el usuario es docente...");
        List<ClaseClassroom> clases = claseRepository.listarPorDocente();
        log.info("Resultado - Se obtuvieron {} clases de docente", clases.size());

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
