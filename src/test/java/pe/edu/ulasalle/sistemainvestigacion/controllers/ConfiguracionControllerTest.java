package pe.edu.ulasalle.sistemainvestigacion.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@ExtendWith(MockitoExtension.class)
class ConfiguracionControllerTest {

    @Mock
    private ConfiguracionSistemaRepository configuracionRepository;

    @Mock
    private ProveedorClassroom proveedorClassroom;

    private ConfiguracionController controller;

    @BeforeEach
    void setUp() {
        controller = new ConfiguracionController(configuracionRepository, proveedorClassroom);
    }

    @Test
    void obtenerConfiguracion_cuandoNoExiste_retornaVacio() {
        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        ResponseEntity<ApiRespuesta<ActualizarCredencialesPeticion>> response =
                controller.obtenerConfiguracion();

        assertNotNull(response.getBody());
        assertEquals("", response.getBody().getDatos().googleClientId());
        assertEquals("", response.getBody().getDatos().googleClientSecret());
        assertEquals("", response.getBody().getDatos().googleRefreshToken());
    }

    @Test
    void obtenerConfiguracion_cuandoExiste_retornaCredenciales() {
        ConfiguracionSistema config =
                ConfiguracionSistema.builder()
                        .id(UUID.randomUUID())
                        .googleClientId("client-id-123")
                        .googleClientSecret("client-secret-456")
                        .googleRefreshToken("refresh-token-789")
                        .build();

        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));

        ResponseEntity<ApiRespuesta<ActualizarCredencialesPeticion>> response =
                controller.obtenerConfiguracion();

        assertNotNull(response.getBody());
        assertEquals("client-id-123", response.getBody().getDatos().googleClientId());
        assertEquals("client-secret-456", response.getBody().getDatos().googleClientSecret());
        assertEquals("refresh-token-789", response.getBody().getDatos().googleRefreshToken());
    }

    @Test
    void actualizarConfiguracion_guardaEInvalidaCache() {
        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        ActualizarCredencialesPeticion peticion =
                new ActualizarCredencialesPeticion("new-client-id", "new-secret", "new-refresh-token");

        ResponseEntity<ApiRespuesta<Void>> response = controller.actualizarConfiguracion(peticion);

        assertEquals(200, response.getStatusCode().value());
        verify(configuracionRepository).save(any(ConfiguracionSistema.class));
        verify(proveedorClassroom).invalidarCache();
    }

    @Test
    void verificarConfiguracion_sinCredencialesConfiguradas_lanzaExcepcion() {
        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        assertThrows(
                ExcepcionDeNegocio.class,
                () -> controller.verificarConfiguracion(null));
    }

    @Test
    void verificarConfiguracion_conCamposVacios_lanzaExcepcion() {
        ActualizarCredencialesPeticion peticion =
                new ActualizarCredencialesPeticion("", "", "");

        assertThrows(
                ExcepcionDeNegocio.class,
                () -> controller.verificarConfiguracion(peticion));
    }
}
