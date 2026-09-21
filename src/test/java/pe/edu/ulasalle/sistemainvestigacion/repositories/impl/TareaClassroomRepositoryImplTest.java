package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.model.CourseWork;
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
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;

@ExtendWith(MockitoExtension.class)
class TareaClassroomRepositoryImplTest {

    @Mock private ProveedorClassroom proveedorClassroom;

    @Mock private ManejadorErroresGoogle manejadorErroresGoogle;

    @Mock private CacheClassroom cacheClassroom;

    @Mock private Classroom classroom;

    @Mock private Classroom.Courses courses;

    @Mock private Classroom.Courses.CourseWork courseWork;

    @Mock private Classroom.Courses.CourseWork.Create createRequest;

    private TareaClassroomRepositoryImpl repository;

    @BeforeEach
    void setUp() {
        repository =
                new TareaClassroomRepositoryImpl(
                        proveedorClassroom, manejadorErroresGoogle, cacheClassroom);
    }

    @Test
    void deberiaDelegarListarPorClaseACacheClassroom() {
        List<TareaClassroom> esperado =
                List.of(
                        TareaClassroom.builder()
                                .idTarea("t1")
                                .idClase("c1")
                                .titulo("Ensayo")
                                .estado(EstadoTarea.PUBLISHED)
                                .build());

        when(cacheClassroom.obtenerTareas(eq("c1"), any())).thenReturn(esperado);

        List<TareaClassroom> resultado = repository.listarPorClase("c1");

        assertEquals(esperado, resultado);
        verify(cacheClassroom).obtenerTareas(eq("c1"), any());
    }

    @Test
    void deberiaGuardarTareaEInvalidarCacheDeClase() throws IOException {
        when(proveedorClassroom.obtenerCliente()).thenReturn(classroom);
        when(classroom.courses()).thenReturn(courses);
        when(courses.courseWork()).thenReturn(courseWork);
        when(courseWork.create(eq("c1"), any(CourseWork.class))).thenReturn(createRequest);
        when(createRequest.setFields(anyString())).thenReturn(createRequest);

        CourseWork cursoRespuesta =
                new CourseWork()
                        .setId("t100")
                        .setCourseId("c1")
                        .setTitle("Investigacion Preliminar")
                        .setDescription("Paso 1")
                        .setState("PUBLISHED")
                        .setMaxPoints(20.0);
        when(createRequest.execute()).thenReturn(cursoRespuesta);

        TareaClassroom aGuardar =
                TareaClassroom.builder()
                        .titulo("Investigacion Preliminar")
                        .descripcion("Paso 1")
                        .puntajeMaximo(20.0)
                        .estado(EstadoTarea.PUBLISHED)
                        .build();

        TareaClassroom resultado = repository.guardar("c1", aGuardar);

        assertNotNull(resultado);
        assertEquals("t100", resultado.getIdTarea());
        assertEquals("c1", resultado.getIdClase());
        assertEquals("Investigacion Preliminar", resultado.getTitulo());
        assertEquals(20.0, resultado.getPuntajeMaximo());
        verify(cacheClassroom).invalidarTareas("c1");
        verify(createRequest)
                .setFields(
                        "id,courseId,title,description,state,alternateLink,dueDate,dueTime,maxPoints");
    }
}
