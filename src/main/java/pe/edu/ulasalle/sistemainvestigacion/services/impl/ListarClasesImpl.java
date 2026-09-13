package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClases;

@Slf4j
@Service
public class ListarClasesImpl implements CasoUsoListarClases {

    private final ClaseRepository claseRepository;

    public ListarClasesImpl(ClaseRepository claseRepository) {
        this.claseRepository = claseRepository;
    }

    @Override
    public List<ClaseRespuesta> ejecutar() {
        log.info("Entrada - Solicitud para listar clases activas");
        log.info("Proceso - Consultando clases en Google Classroom...");
        List<ClaseClassroom> clases = claseRepository.listarTodas();
        log.info("Resultado - Se obtuvieron {} clases", clases.size());

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
