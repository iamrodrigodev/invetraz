package pe.edu.ulasalle.sistemainvestigacion.services;

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
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@ExtendWith(MockitoExtension.class)
class ServicioConfiguracionTest {

    @Mock private ConfiguracionSistemaRepository configuracionRepository;

    @Mock private ProveedorClassroom proveedorClassroom;

    @Mock private ProveedorDrive proveedorDrive;

    private ServicioConfiguracion servicio;

    @BeforeEach
    void setUp() {
        servicio =
                new ServicioConfiguracion(
                        configuracionRepository, proveedorClassroom, proveedorDrive);
    }

    @Test
    void obtenerConfiguracion_cuandoNoExiste_retornaVacio() {
        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        ActualizarCredencialesPeticion respuesta = servicio.obtenerConfiguracion();

        assertNotNull(respuesta);
        assertEquals("", respuesta.googleClientId());
        assertEquals("", respuesta.googleClientSecret());
        assertEquals("", respuesta.googleRefreshToken());
        assertEquals(false, respuesta.googleVerificado());
        assertEquals(false, respuesta.driveVerificado());
    }

    @Test
    void obtenerConfiguracion_cuandoExiste_retornaCredenciales() {
        ConfiguracionSistema config =
                ConfiguracionSistema.builder()
                        .id(UUID.randomUUID())
                        .googleClientId("client-id-123")
                        .googleClientSecret("client-secret-456")
                        .googleRefreshToken("refresh-token-789")
                        .googleDriveFolderId("folder-123")
                        .googleDriveFolderName("Carpeta Test")
                        .googleVerificado(true)
                        .driveVerificado(true)
                        .build();

        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));

        ActualizarCredencialesPeticion respuesta = servicio.obtenerConfiguracion();

        assertNotNull(respuesta);
        assertEquals("client-id-123", respuesta.googleClientId());
        assertEquals("client-secret-456", respuesta.googleClientSecret());
        assertEquals("refresh-token-789", respuesta.googleRefreshToken());
        assertEquals("folder-123", respuesta.googleDriveFolderId());
        assertEquals("Carpeta Test", respuesta.googleDriveFolderName());
        assertEquals(true, respuesta.googleVerificado());
        assertEquals(true, respuesta.driveVerificado());
    }

    @Test
    void actualizarConfiguracion_guardaEInvalidaCache() {
        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        ActualizarCredencialesPeticion peticion =
                new ActualizarCredencialesPeticion(
                        "new-client-id", "new-secret", "new-refresh-token");

        servicio.actualizarConfiguracion(peticion);

        verify(configuracionRepository).save(any(ConfiguracionSistema.class));
        verify(proveedorClassroom).invalidarCache();
        verify(proveedorDrive).invalidarCache();
    }

    @Test
    void verificarConfiguracion_sinCredencialesConfiguradas_lanzaExcepcion() {
        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        assertThrows(ExcepcionDeNegocio.class, () -> servicio.verificarConfiguracion(null));
    }

    @Test
    void verificarConfiguracion_conCamposVacios_lanzaExcepcion() {
        ActualizarCredencialesPeticion peticion = new ActualizarCredencialesPeticion("", "", "");

        assertThrows(ExcepcionDeNegocio.class, () -> servicio.verificarConfiguracion(peticion));
    }
}
