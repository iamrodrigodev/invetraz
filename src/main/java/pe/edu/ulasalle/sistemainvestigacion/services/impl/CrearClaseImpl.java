package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearClasePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;

@Slf4j
@Service
public class CrearClaseImpl implements CasoUsoCrearClase {

    private final ClaseRepository claseRepository;

    public CrearClaseImpl(ClaseRepository claseRepository) {
        this.claseRepository = claseRepository;
    }

    @Override
    public ClaseRespuesta ejecutar(CrearClasePeticion peticion) {
        ClaseClassroom nuevaClase =
                ClaseClassroom.builder()
                        .nombre(peticion.getNombre())
                        .seccion(peticion.getSeccion())
                        .profesorId(peticion.getProfesorId())
                        .estado(EstadoClase.PROVISIONED)
                        .build();

        ClaseClassroom claseCreada = claseRepository.guardar(nuevaClase);

        return ClaseRespuesta.builder()
                .idClassroom(claseCreada.getIdClassroom())
                .nombre(claseCreada.getNombre())
                .estado(claseCreada.getEstado())
                .enlaceClase(claseCreada.getEnlaceClase())
                .build();
    }
}
