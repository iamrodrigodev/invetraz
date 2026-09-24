package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.mapper.ClaseMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesDocente;

@Slf4j
@Service
public class ListarClasesDocenteImpl implements CasoUsoListarClasesDocente {

    private final ClaseRepository claseRepository;
    private final ClaseMapper claseMapper;

    public ListarClasesDocenteImpl(ClaseRepository claseRepository, ClaseMapper claseMapper) {
        this.claseRepository = claseRepository;
        this.claseMapper = claseMapper;
    }

    @Override
    public List<ClaseRespuesta> ejecutar() {
        log.info("Consultando clases del docente en Google Classroom");
        List<ClaseClassroom> clases = claseRepository.listarPorDocente();
        log.info("Clases de docente obtenidas: {}", clases.size());

        if (clases.isEmpty()) {
            return Collections.emptyList();
        }

        return claseMapper.toRespuestaList(clases);
    }
}
