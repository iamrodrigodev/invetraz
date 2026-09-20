package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.model.Course;
import java.io.IOException;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.CacheClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ManejadorErroresGoogle;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;

@ExtendWith(MockitoExtension.class)
class ClaseClassroomRepositoryImplTest {

    @Mock
    private ProveedorClassroom proveedorClassroom;

    @Mock
    private ManejadorErroresGoogle manejadorErroresGoogle;

    @Mock
    private CacheClassroom cacheClassroom;

    @Mock
    private Classroom classroom;

    @Mock
    private Classroom.Courses courses;

    @Mock
    private Classroom.Courses.Create createRequest;

    @Mock
    private Classroom.Courses.Patch patchRequest;

    private ClaseClassroomRepositoryImpl repository;

    @BeforeEach
    void setUp() {
        repository =
                new ClaseClassroomRepositoryImpl(
                        proveedorClassroom, manejadorErroresGoogle, cacheClassroom);
    }

    @Test
    void deberiaDelegarListarPorDocenteACacheClassroom() {
        List<ClaseClassroom> esperado =
                List.of(
                        ClaseClassroom.builder()
                                .idClassroom("c1")
                                .nombre("Matematicas")
                                .estado(EstadoClase.ACTIVE)
                                .build());

        when(cacheClassroom.obtenerClases(eq("DOCENTE"), any())).thenReturn(esperado);

        List<ClaseClassroom> resultado = repository.listarPorDocente();

        assertEquals(esperado, resultado);
        verify(cacheClassroom).obtenerClases(eq("DOCENTE"), any());
    }

    @Test
    void deberiaDelegarListarPorAlumnoACacheClassroom() {
        List<ClaseClassroom> esperado =
                List.of(
                        ClaseClassroom.builder()
                                .idClassroom("c2")
                                .nombre("Fisica")
                                .estado(EstadoClase.ACTIVE)
                                .build());

        when(cacheClassroom.obtenerClases(eq("ALUMNO"), any())).thenReturn(esperado);

        List<ClaseClassroom> resultado = repository.listarPorAlumno();

        assertEquals(esperado, resultado);
        verify(cacheClassroom).obtenerClases(eq("ALUMNO"), any());
    }

    @Test
    void deberiaGuardarClaseEInvalidarCache() throws IOException {
        when(proveedorClassroom.obtenerCliente()).thenReturn(classroom);
        when(classroom.courses()).thenReturn(courses);
        when(courses.create(any(Course.class))).thenReturn(createRequest);
        when(createRequest.setFields(anyString())).thenReturn(createRequest);

        Course cursoRespuesta =
                new Course()
                        .setId("class-123")
                        .setName("Quimica")
                        .setCourseState("ACTIVE")
                        .setAlternateLink("https://classroom.google.com/c/123");
        when(createRequest.execute()).thenReturn(cursoRespuesta);

        ClaseClassroom aGuardar =
                ClaseClassroom.builder()
                        .nombre("Quimica")
                        .seccion("A")
                        .profesorId("prof-1")
                        .estado(EstadoClase.ACTIVE)
                        .build();

        ClaseClassroom resultado = repository.guardar(aGuardar);

        assertNotNull(resultado);
        assertEquals("class-123", resultado.getIdClassroom());
        assertEquals("Quimica", resultado.getNombre());
        assertEquals(EstadoClase.ACTIVE, resultado.getEstado());
        verify(cacheClassroom).invalidarClases();
        verify(createRequest).setFields("id,name,courseState,alternateLink");
    }

    @Test
    void deberiaArchivarClaseEInvalidarCache() throws IOException {
        when(proveedorClassroom.obtenerCliente()).thenReturn(classroom);
        when(classroom.courses()).thenReturn(courses);
        when(courses.patch(eq("class-123"), any(Course.class))).thenReturn(patchRequest);
        when(patchRequest.setUpdateMask("courseState")).thenReturn(patchRequest);
        when(patchRequest.setFields(anyString())).thenReturn(patchRequest);
        when(patchRequest.execute()).thenReturn(new Course().setId("class-123").setCourseState("ARCHIVED"));

        repository.archivar("class-123");

        verify(patchRequest).setFields("id,courseState");
        verify(patchRequest).setUpdateMask("courseState");
        verify(cacheClassroom).invalidarClases();
    }
}
