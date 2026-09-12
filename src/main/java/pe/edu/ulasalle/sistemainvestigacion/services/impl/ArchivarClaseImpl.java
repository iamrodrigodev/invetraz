package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.model.Course;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoArchivarClase;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArchivarClaseImpl implements CasoUsoArchivarClase {

    private final Classroom clienteGoogle;

    @Override
    public void ejecutar(String idClassroom) {
        try {
            Course cursoCambios = new Course().setCourseState("ARCHIVED");
            clienteGoogle
                    .courses()
                    .patch(idClassroom, cursoCambios)
                    .setUpdateMask("courseState")
                    .execute();
        } catch (Exception e) {
            log.error("Error", e);
            throw new ExcepcionPersonalizada("Error", 500);
        }
    }
}
