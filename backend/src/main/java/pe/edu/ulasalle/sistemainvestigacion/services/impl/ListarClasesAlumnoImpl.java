package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.mapper.ClaseMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesAlumno;

@Slf4j
@Service
public class ListarClasesAlumnoImpl implements CasoUsoListarClasesAlumno {

    private final ClaseRepository claseRepository;
    private final ClaseMapper claseMapper;

    public ListarClasesAlumnoImpl(ClaseRepository claseRepository, ClaseMapper claseMapper) {
        this.claseRepository = claseRepository;
        this.claseMapper = claseMapper;
    }

    @Override
    public List<ClaseRespuesta> ejecutar() {
        log.info("Consultando clases del estudiante en Google Classroom");
        List<ClaseClassroom> clases = claseRepository.listarPorAlumno();
        log.info("Clases de estudiante obtenidas: {}", clases.size());

        if (clases.isEmpty()) {
            return Collections.emptyList();
        }

        return claseMapper.toRespuestaList(clases);
    }
}
