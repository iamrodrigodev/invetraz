package pe.edu.ulasalle.sistemainvestigacion.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioConfiguracion;

@ExtendWith(MockitoExtension.class)
class ConfiguracionControllerTest {

    @Mock private ServicioConfiguracion servicioConfiguracion;

    private ConfiguracionController controller;

    @BeforeEach
    void setUp() {
        controller = new ConfiguracionController(servicioConfiguracion);
    }

    @Test
    void obtenerConfiguracion_delegaEnServicio() {
        ActualizarCredencialesPeticion mockRespuesta =
                new ActualizarCredencialesPeticion(
                        "client-123", "secret-456", "token-789", "folder-1", "Plantillas", true, true);
        when(servicioConfiguracion.obtenerConfiguracion()).thenReturn(mockRespuesta);

        ResponseEntity<ApiRespuesta<ActualizarCredencialesPeticion>> response =
                controller.obtenerConfiguracion();

        assertNotNull(response.getBody());
        assertEquals("client-123", response.getBody().getDatos().googleClientId());
        verify(servicioConfiguracion).obtenerConfiguracion();
    }

    @Test
    void actualizarConfiguracion_delegaEnServicio() {
        ActualizarCredencialesPeticion peticion =
                new ActualizarCredencialesPeticion("client-123", "secret-456", "token-789");

        ResponseEntity<ApiRespuesta<Void>> response = controller.actualizarConfiguracion(peticion);

        assertEquals(200, response.getStatusCode().value());
        verify(servicioConfiguracion).actualizarConfiguracion(peticion);
    }

    @Test
    void verificarConfiguracion_delegaEnServicio() {
        ActualizarCredencialesPeticion peticion =
                new ActualizarCredencialesPeticion("client-123", "secret-456", "token-789");
        Map<String, Object> mockRes = Map.of("valido", true, "mensaje", "Conexión exitosa");
        when(servicioConfiguracion.verificarConfiguracion(peticion)).thenReturn(mockRes);

        ResponseEntity<ApiRespuesta<Map<String, Object>>> response =
                controller.verificarConfiguracion(peticion);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(true, response.getBody().getDatos().get("valido"));
        verify(servicioConfiguracion).verificarConfiguracion(peticion);
    }
}
