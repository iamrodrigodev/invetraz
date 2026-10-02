package pe.edu.ulasalle.sistemainvestigacion.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.CarpetaPlantillasRespuestaDto;
import pe.edu.ulasalle.sistemainvestigacion.mapper.PlantillaMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ActividadSeguimientoRepository;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@ExtendWith(MockitoExtension.class)
class ServicioDrivePlantillasTest {

    @Mock private ProveedorDrive proveedorDrive;

    @Mock private ConfiguracionSistemaRepository configuracionRepository;

    @Mock private ActividadSeguimientoRepository actividadSeguimientoRepository;

    private ServicioDrivePlantillas servicio;

    @BeforeEach
    void setUp() {
        servicio =
                new ServicioDrivePlantillas(
                        proveedorDrive,
                        configuracionRepository,
                        actividadSeguimientoRepository,
                        Mappers.getMapper(PlantillaMapper.class));
    }

    @Test
    void extraerIdCarpeta_conFormatosDiversos() {
        assertEquals(
                "1a2b3c4d_XYZ-99",
                ServicioDrivePlantillas.extraerIdCarpeta(
                        "https://drive.google.com/drive/folders/1a2b3c4d_XYZ-99"));
        assertEquals(
                "1a2b3c4d_XYZ-99",
                ServicioDrivePlantillas.extraerIdCarpeta(
                        "https://drive.google.com/drive/u/0/folders/1a2b3c4d_XYZ-99?usp=sharing"));
        assertEquals(
                "folder123",
                ServicioDrivePlantillas.extraerIdCarpeta(
                        "https://drive.google.com/open?id=folder123"));
        assertEquals("raw-id-123", ServicioDrivePlantillas.extraerIdCarpeta("raw-id-123"));
        assertEquals("", ServicioDrivePlantillas.extraerIdCarpeta(""));
        assertEquals("", ServicioDrivePlantillas.extraerIdCarpeta(null));
    }

    @Test
    void vincularCarpeta_conIdVacio_lanzaExcepcion() {
        assertThrows(ExcepcionDeNegocio.class, () -> servicio.vincularCarpeta("  "));
    }

    @Test
    void vincularCarpeta_cuandoDriveFalla_guardaIdNormalizado() {
        ConfiguracionSistema config =
                ConfiguracionSistema.builder()
                        .googleClientId("id")
                        .googleClientSecret("sec")
                        .googleRefreshToken("ref")
                        .googleVerificado(true)
                        .build();

        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));
        when(proveedorDrive.obtenerCliente())
                .thenThrow(new RuntimeException("Drive no disponible"));

        CarpetaPlantillasRespuestaDto resultado =
                servicio.vincularCarpeta("https://drive.google.com/drive/folders/folder-pendiente");

        assertTrue(resultado.carpetaConfigurada());
        assertEquals("folder-pendiente", resultado.carpetaId());
        assertNull(resultado.carpetaNombre());
        assertTrue(resultado.plantillas().isEmpty());
        assertEquals("folder-pendiente", config.getGoogleDriveFolderId());
        assertNull(config.getGoogleDriveFolderName());
        verify(configuracionRepository).save(config);
    }

    @Test
    void vincularCarpeta_cuandoGoogleNoVerificado_guardaCarpetaConDriveNoVerificado() {
        ConfiguracionSistema config =
                ConfiguracionSistema.builder()
                        .googleClientId("id")
                        .googleClientSecret("sec")
                        .googleRefreshToken("ref")
                        .googleVerificado(false)
                        .driveVerificado(true)
                        .build();

        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));

        CarpetaPlantillasRespuestaDto resultado =
                servicio.vincularCarpeta("https://drive.google.com/drive/folders/folder-pendiente");

        assertTrue(resultado.carpetaConfigurada());
        assertEquals("folder-pendiente", resultado.carpetaId());
        assertNull(resultado.carpetaNombre());
        assertFalse(resultado.driveVerificado());
        assertFalse(config.getDriveVerificado());
        verify(configuracionRepository).save(config);
    }

    @Test
    void obtenerPlantillasConfiguradas_cuandoNoHayConfiguracion_retornaVacio() {
        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());

        CarpetaPlantillasRespuestaDto resultado = servicio.obtenerPlantillasConfiguradas();

        assertFalse(resultado.carpetaConfigurada());
        assertNull(resultado.carpetaId());
        assertNull(resultado.carpetaNombre());
        assertTrue(resultado.plantillas().isEmpty());
    }

    @Test
    void obtenerPlantillasConfiguradas_cuandoCarpetaEsNull_retornaVacio() {
        ConfiguracionSistema config =
                ConfiguracionSistema.builder()
                        .googleClientId("id")
                        .googleClientSecret("sec")
                        .googleRefreshToken("ref")
                        .googleDriveFolderId(null)
                        .build();

        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));

        CarpetaPlantillasRespuestaDto resultado = servicio.obtenerPlantillasConfiguradas();

        assertFalse(resultado.carpetaConfigurada());
        assertNull(resultado.carpetaId());
        assertTrue(resultado.plantillas().isEmpty());
    }

    @Test
    void obtenerPlantillasConfiguradas_cuandoDriveFalla_retornaCarpetaSinPlantillas() {
        ConfiguracionSistema config =
                ConfiguracionSistema.builder()
                        .googleClientId("id")
                        .googleClientSecret("sec")
                        .googleRefreshToken("ref")
                        .googleDriveFolderId("folder-pendiente")
                        .googleDriveFolderName(null)
                        .googleVerificado(true)
                        .build();

        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));
        when(proveedorDrive.obtenerCliente())
                .thenThrow(new RuntimeException("Drive no disponible"));

        CarpetaPlantillasRespuestaDto resultado = servicio.obtenerPlantillasConfiguradas();

        assertTrue(resultado.carpetaConfigurada());
        assertEquals("folder-pendiente", resultado.carpetaId());
        assertNull(resultado.carpetaNombre());
        assertTrue(resultado.plantillas().isEmpty());
        assertFalse(resultado.driveVerificado());
    }

    @Test
    void
            obtenerPlantillasConfiguradas_cuandoGoogleNoVerificado_corrigeDriveYRetornaSinPlantillas() {
        ConfiguracionSistema config =
                ConfiguracionSistema.builder()
                        .googleClientId("id")
                        .googleClientSecret("sec")
                        .googleRefreshToken("ref")
                        .googleDriveFolderId("folder-pendiente")
                        .googleDriveFolderName("Carpeta")
                        .googleVerificado(false)
                        .driveVerificado(true)
                        .build();

        when(configuracionRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));

        CarpetaPlantillasRespuestaDto resultado = servicio.obtenerPlantillasConfiguradas();

        assertTrue(resultado.carpetaConfigurada());
        assertEquals("folder-pendiente", resultado.carpetaId());
        assertEquals("Carpeta", resultado.carpetaNombre());
        assertFalse(resultado.driveVerificado());
        assertFalse(config.getDriveVerificado());
        assertTrue(resultado.plantillas().isEmpty());
        verify(configuracionRepository).save(config);
    }
}
