package pe.edu.ulasalle.sistemainvestigacion.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ReadinessRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioReadiness;

@ExtendWith(MockitoExtension.class)
class EstadoControllerTest {

    @Mock private ServicioReadiness servicioReadiness;

    private EstadoController controller;

    @BeforeEach
    void setUp() {
        controller = new EstadoController(servicioReadiness);
    }

    @Test
    void verificarEstado_retornaEstadoOperativoSinConsultarDependencias() {
        ResponseEntity<ApiRespuesta<Void>> response = controller.verificarEstado();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(
                "El sistema de investigacion esta funcionando correctamente.",
                response.getBody().getMensaje());
    }

    @Test
    void verificarReadiness_delegaEnServicio() {
        ReadinessRespuesta readiness = ReadinessRespuesta.builder().listo(true).build();
        when(servicioReadiness.verificar()).thenReturn(readiness);

        ResponseEntity<ApiRespuesta<ReadinessRespuesta>> response = controller.verificarReadiness();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(readiness, response.getBody().getDatos());
        verify(servicioReadiness).verificar();
    }
}
