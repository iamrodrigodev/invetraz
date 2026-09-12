package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.model.Course;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearClasePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;

@Slf4j
@Service
@RequiredArgsConstructor
public class CrearClaseImpl implements CasoUsoCrearClase {

    private final Classroom clienteGoogle;

    @Override
    public ClaseRespuesta ejecutar(CrearClasePeticion peticion) {
        try {
            Course curso =
                    new Course()
                            .setName(peticion.getNombre())
                            .setSection(peticion.getSeccion())
                            .setOwnerId(peticion.getProfesorId())
                            .setCourseState("PROVISIONED");

            Course cursoCreado = clienteGoogle.courses().create(curso).execute();

            return ClaseRespuesta.builder()
                    .idClassroom(cursoCreado.getId())
                    .nombre(cursoCreado.getName())
                    .estado(
                            pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase.valueOf(
                                    cursoCreado.getCourseState()))
                    .enlaceClase(cursoCreado.getAlternateLink())
                    .build();

        } catch (Exception e) {
            log.error("Error", e);
            throw new ExcepcionPersonalizada("Error", 500);
        }
    }
}
