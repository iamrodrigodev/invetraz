package pe.edu.ulasalle.sistemainvestigacion.services.asincrono;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;

@ExtendWith(MockitoExtension.class)
class ServicioTareasAsincronoTest {

    @Mock private TareaRepository tareaRepository;

    private ServicioTareasAsincrono servicio;

    @BeforeEach
    void setUp() {
        servicio = new ServicioTareasAsincrono(tareaRepository);
    }

    @Test
    void deberiaEjecutarCreacionEnSegundoPlanoExitosamente() {
        TareaClassroom tarea = TareaClassroom.builder().titulo("Tarea Test").build();
        TareaClassroom guardada =
                TareaClassroom.builder().idTarea("t-1").titulo("Tarea Test").build();

        when(tareaRepository.guardar(eq("c-1"), any(TareaClassroom.class))).thenReturn(guardada);

        assertDoesNotThrow(() -> servicio.ejecutarCreacionEnSegundoPlano("c-1", tarea));

        verify(tareaRepository).guardar("c-1", tarea);
    }

    @Test
    void deberiaManejarErroresEnSegundoPlanoSinLanzarExcepcion() {
        TareaClassroom tarea = TareaClassroom.builder().titulo("Tarea Fallida").build();

        doThrow(new RuntimeException("Error en Google Classroom"))
                .when(tareaRepository)
                .guardar(eq("c-1"), any(TareaClassroom.class));

        assertDoesNotThrow(() -> servicio.ejecutarCreacionEnSegundoPlano("c-1", tarea));

        verify(tareaRepository).guardar("c-1", tarea);
    }
}
