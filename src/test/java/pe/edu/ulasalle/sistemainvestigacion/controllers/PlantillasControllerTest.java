package pe.edu.ulasalle.sistemainvestigacion.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.VincularCarpetaDrivePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.CarpetaPlantillasRespuestaDto;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.PlantillaXlsxDto;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioDrivePlantillas;

@ExtendWith(MockitoExtension.class)
class PlantillasControllerTest {

    @Mock private ServicioDrivePlantillas servicioDrivePlantillas;

    private PlantillasController controller;

    @BeforeEach
    void setUp() {
        controller = new PlantillasController(servicioDrivePlantillas);
    }

    @Test
    void obtenerPlantillas_retornaDatosCorrectamente() {
        CarpetaPlantillasRespuestaDto dto =
                CarpetaPlantillasRespuestaDto.builder()
                        .carpetaConfigurada(true)
                        .carpetaId("folder-123")
                        .carpetaNombre("Plantillas 2026")
                        .plantillas(
                                List.of(
                                        PlantillaXlsxDto.builder()
                                                .id("file-1")
                                                .nombre("plantilla_tesis.xlsx")
                                                .tipoMime(
                                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                                                .build()))
                        .build();

        when(servicioDrivePlantillas.obtenerPlantillasConfiguradas()).thenReturn(dto);

        ResponseEntity<ApiRespuesta<CarpetaPlantillasRespuestaDto>> response =
                controller.obtenerPlantillas();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("folder-123", response.getBody().getDatos().carpetaId());
        assertEquals(1, response.getBody().getDatos().plantillas().size());
        verify(servicioDrivePlantillas).obtenerPlantillasConfiguradas();
    }

    @Test
    void verificarCarpeta_delegaEnServicioYRetornaPlantillas() {
        String urlOId = "https://drive.google.com/drive/folders/folder-abc";
        CarpetaPlantillasRespuestaDto dto =
                CarpetaPlantillasRespuestaDto.builder()
                        .carpetaConfigurada(true)
                        .carpetaId("folder-abc")
                        .carpetaNombre("Formatos")
                        .plantillas(Collections.emptyList())
                        .build();

        when(servicioDrivePlantillas.verificarCarpeta(urlOId)).thenReturn(dto);

        VincularCarpetaDrivePeticion peticion = new VincularCarpetaDrivePeticion(urlOId);
        ResponseEntity<ApiRespuesta<CarpetaPlantillasRespuestaDto>> response =
                controller.verificarCarpeta(peticion);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("folder-abc", response.getBody().getDatos().carpetaId());
        verify(servicioDrivePlantillas).verificarCarpeta(urlOId);
    }

    @Test
    void vincularCarpeta_delegaEnServicioYRetornaPlantillas() {
        String urlOId = "https://drive.google.com/drive/folders/folder-abc";
        CarpetaPlantillasRespuestaDto dto =
                CarpetaPlantillasRespuestaDto.builder()
                        .carpetaConfigurada(true)
                        .carpetaId("folder-abc")
                        .carpetaNombre("Formatos")
                        .plantillas(Collections.emptyList())
                        .build();

        when(servicioDrivePlantillas.vincularCarpeta(urlOId)).thenReturn(dto);

        VincularCarpetaDrivePeticion peticion = new VincularCarpetaDrivePeticion(urlOId);
        ResponseEntity<ApiRespuesta<CarpetaPlantillasRespuestaDto>> response =
                controller.vincularCarpeta(peticion);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("folder-abc", response.getBody().getDatos().carpetaId());
        verify(servicioDrivePlantillas).vincularCarpeta(urlOId);
    }
}
