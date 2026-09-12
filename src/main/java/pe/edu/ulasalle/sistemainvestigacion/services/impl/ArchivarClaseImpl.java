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
        claseRepository.archivar(idClassroom);
    }
}
