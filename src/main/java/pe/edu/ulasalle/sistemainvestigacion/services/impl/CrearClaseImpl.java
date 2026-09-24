package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearClasePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.mapper.ClaseMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;

@Slf4j
@Service
public class CrearClaseImpl implements CasoUsoCrearClase {

    private final ClaseRepository claseRepository;
    private final ClaseMapper claseMapper;

    public CrearClaseImpl(ClaseRepository claseRepository, ClaseMapper claseMapper) {
        this.claseRepository = claseRepository;
        this.claseMapper = claseMapper;
    }

    @Override
    public ClaseRespuesta ejecutar(CrearClasePeticion peticion) {
        log.info(
                "Creando clase '{}' (seccion: '{}', profesorId: '{}')",
                peticion.getNombre(),
                peticion.getSeccion(),
                peticion.getProfesorId());

        ClaseClassroom nuevaClase = claseMapper.toDominio(peticion);

        ClaseClassroom claseCreada = claseRepository.guardar(nuevaClase);

        log.info(
                "Clase '{}' creada exitosamente con id: '{}'",
                claseCreada.getNombre(),
                claseCreada.getIdClassroom());

        return claseMapper.toRespuesta(claseCreada);
    }
}
