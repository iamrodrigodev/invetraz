package pe.edu.ulasalle.sistemainvestigacion.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.CarpetaPlantillasRespuestaDto;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@ExtendWith(MockitoExtension.class)
class ServicioDrivePlantillasTest {

    @Mock private ProveedorDrive proveedorDrive;

    @Mock private ConfiguracionSistemaRepository configuracionRepository;

    private ServicioDrivePlantillas servicio;

    @BeforeEach
    void setUp() {
        servicio = new ServicioDrivePlantillas(proveedorDrive, configuracionRepository);
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
}
