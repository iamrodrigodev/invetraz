package pe.edu.ulasalle.sistemainvestigacion.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioActividadesSeguimiento;

@ExtendWith(MockitoExtension.class)
class ActividadesSeguimientoControllerTest {

    @Mock private ServicioActividadesSeguimiento servicioActividadesSeguimiento;

    private ActividadesSeguimientoController controller;

    @BeforeEach
    void setUp() {
        controller = new ActividadesSeguimientoController(servicioActividadesSeguimiento);
    }

    @Test
    void listarActividades_retornaListaExitosa() {
        List<TareaRespuesta> esperado =
                List.of(
                        TareaRespuesta.builder()
                                .idTarea("t-1")
                                .idClase("c-1")
                                .titulo("Avance 1")
                                .estado(EstadoTarea.PUBLISHED)
                                .build());

        when(servicioActividadesSeguimiento.listarActividades()).thenReturn(esperado);

        ResponseEntity<ApiRespuesta<List<TareaRespuesta>>> respuesta =
                controller.listarActividades();

        assertEquals(200, respuesta.getStatusCode().value());
        assertNotNull(respuesta.getBody());
        assertEquals(1, respuesta.getBody().getDatos().size());
        verify(servicioActividadesSeguimiento).listarActividades();
    }

    @Test
    void sincronizarActividades_retornaListaSincronizada() {
        List<TareaRespuesta> esperado =
                List.of(
                        TareaRespuesta.builder()
                                .idTarea("t-2")
                                .idClase("c-1")
                                .titulo("Avance Sincronizado")
                                .estado(EstadoTarea.PUBLISHED)
                                .build());

        when(servicioActividadesSeguimiento.sincronizarConClassroom()).thenReturn(esperado);

        ResponseEntity<ApiRespuesta<List<TareaRespuesta>>> respuesta =
                controller.sincronizarActividades();

        assertEquals(200, respuesta.getStatusCode().value());
        assertNotNull(respuesta.getBody());
        assertEquals(1, respuesta.getBody().getDatos().size());
        verify(servicioActividadesSeguimiento).sincronizarConClassroom();
    }
}
