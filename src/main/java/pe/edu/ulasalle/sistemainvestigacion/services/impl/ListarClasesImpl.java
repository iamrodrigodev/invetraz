package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
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
        return claseRepository.listarTodas().stream()
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
