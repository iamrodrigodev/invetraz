package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoArchivarClase;

@Slf4j
@Service
public class ArchivarClaseImpl implements CasoUsoArchivarClase {

    private final ClaseRepository claseRepository;

    public ArchivarClaseImpl(ClaseRepository claseRepository) {
        this.claseRepository = claseRepository;
    }

    @Override
    public void ejecutar(String idClassroom) {
        log.info("Entrada - Archivando clase con idClassroom: '{}'", idClassroom);
        log.info("Proceso - Cambiando estado de la clase a ARCHIVED en Google Classroom...");
        claseRepository.archivar(idClassroom);
        log.info("Resultado - Clase '{}' archivada exitosamente", idClassroom);
    }
}
