package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import com.google.api.services.classroom.model.Course;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.CacheClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ManejadorErroresGoogle;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;

@Slf4j
@Repository
public class ClaseClassroomRepositoryImpl implements ClaseRepository {

    private static final List<String> ESTADOS_CURSO_VISIBLES = List.of("ACTIVE", "PROVISIONED");
    private static final String CAMPOS_CURSO_LECTURA = "courses(id,name,courseState,alternateLink)";
    private static final String CAMPOS_CURSO_CREACION = "id,name,courseState,alternateLink";
    private static final String CAMPOS_CURSO_EDICION = "id,courseState";

    private final ProveedorClassroom proveedorClassroom;
    private final ManejadorErroresGoogle manejadorErroresGoogle;
    private final CacheClassroom cacheClassroom;

    public ClaseClassroomRepositoryImpl(
            ProveedorClassroom proveedorClassroom,
            ManejadorErroresGoogle manejadorErroresGoogle,
            CacheClassroom cacheClassroom) {
        this.proveedorClassroom = proveedorClassroom;
        this.manejadorErroresGoogle = manejadorErroresGoogle;
        this.cacheClassroom = cacheClassroom;
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

            Course cursoCreado =
                    proveedorClassroom
                            .obtenerCliente()
                            .courses()
                            .create(curso)
                            .setFields(CAMPOS_CURSO_CREACION)
                            .execute();

            cacheClassroom.invalidarClases();

            return ClaseClassroom.builder()
                    .idClassroom(cursoCreado.getId())
                    .nombre(cursoCreado.getName())
                    .estado(EstadoClase.valueOf(cursoCreado.getCourseState()))
                    .enlaceClase(cursoCreado.getAlternateLink())
                    .build();

        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar("ClaseClassroomRepository.guardar", e);
        }
    }

    @Override
    public void archivar(String idClassroom) {
        try {
            Course cursoCambios = new Course().setCourseState(EstadoClase.ARCHIVED.name());
            proveedorClassroom
                    .obtenerCliente()
                    .courses()
                    .patch(idClassroom, cursoCambios)
                    .setUpdateMask("courseState")
                    .setFields(CAMPOS_CURSO_EDICION)
                    .execute();

            cacheClassroom.invalidarClases();
        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar("ClaseClassroomRepository.archivar", e);
        }
    }

    @Override
    public List<ClaseClassroom> listarPorDocente() {
        return cacheClassroom.obtenerClases("DOCENTE", this::consultarClasesDocenteDirecto);
    }

    @Override
    public List<ClaseClassroom> listarPorAlumno() {
        return cacheClassroom.obtenerClases("ALUMNO", this::consultarClasesAlumnoDirecto);
    }

    private List<ClaseClassroom> consultarClasesDocenteDirecto() {
        try {
            var response =
                    proveedorClassroom
                            .obtenerCliente()
                            .courses()
                            .list()
                            .setTeacherId("me")
                            .setPageSize(20)
                            .setCourseStates(ESTADOS_CURSO_VISIBLES)
                            .setFields(CAMPOS_CURSO_LECTURA)
                            .execute();
            return mapearCursos(response.getCourses());
        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar("ClaseClassroomRepository.listarPorDocente", e);
        }
    }

    private List<ClaseClassroom> consultarClasesAlumnoDirecto() {
        try {
            var response =
                    proveedorClassroom
                            .obtenerCliente()
                            .courses()
                            .list()
                            .setStudentId("me")
                            .setPageSize(20)
                            .setCourseStates(ESTADOS_CURSO_VISIBLES)
                            .setFields(CAMPOS_CURSO_LECTURA)
                            .execute();
            return mapearCursos(response.getCourses());
        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar("ClaseClassroomRepository.listarPorAlumno", e);
        }
    }

    private List<ClaseClassroom> mapearCursos(List<Course> cursos) {
        if (cursos == null || cursos.isEmpty()) {
            return Collections.emptyList();
        }
        List<ClaseClassroom> resultado = new ArrayList<>(cursos.size());
        for (Course curso : cursos) {
            String estadoStr = curso.getCourseState();
            EstadoClase estado =
                    estadoStr != null ? EstadoClase.valueOf(estadoStr) : EstadoClase.PROVISIONED;
            resultado.add(
                    ClaseClassroom.builder()
                            .idClassroom(curso.getId())
                            .nombre(curso.getName())
                            .estado(estado)
                            .enlaceClase(curso.getAlternateLink())
                            .build());
        }
        return resultado;
    }
}
