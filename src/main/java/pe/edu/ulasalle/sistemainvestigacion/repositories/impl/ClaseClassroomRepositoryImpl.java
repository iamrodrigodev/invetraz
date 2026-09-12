package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.model.Course;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;

@Slf4j
@Repository
public class ClaseClassroomRepositoryImpl implements ClaseRepository {

    private final Classroom clienteGoogle;

    public ClaseClassroomRepositoryImpl(Classroom clienteGoogle) {
        this.clienteGoogle = clienteGoogle;
    }

    @Override
    public ClaseClassroom guardar(ClaseClassroom clase) {
        try {
            Course curso =
                    new Course()
                            .setName(clase.getNombre())
                            .setSection(clase.getSeccion())
                            .setOwnerId(clase.getProfesorId())
                            .setCourseState(clase.getEstado().name());

            Course cursoCreado = clienteGoogle.courses().create(curso).execute();

            return ClaseClassroom.builder()
                    .idClassroom(cursoCreado.getId())
                    .nombre(cursoCreado.getName())
                    .estado(EstadoClase.valueOf(cursoCreado.getCourseState()))
                    .enlaceClase(cursoCreado.getAlternateLink())
                    .build();

        } catch (Exception e) {
            log.error("Error al crear la clase en Google Classroom", e);
            throw new ExcepcionPersonalizada(MensajesDeError.ERROR_INTERNO);
        }
    }

    @Override
    public void archivar(String idClassroom) {
        try {
            Course cursoCambios = new Course().setCourseState(EstadoClase.ARCHIVED.name());
            clienteGoogle
                    .courses()
                    .patch(idClassroom, cursoCambios)
                    .setUpdateMask("courseState")
                    .execute();
        } catch (Exception e) {
            log.error("Error al archivar la clase en Google Classroom", e);
            throw new ExcepcionPersonalizada(MensajesDeError.ERROR_INTERNO);
        }
    }
}
