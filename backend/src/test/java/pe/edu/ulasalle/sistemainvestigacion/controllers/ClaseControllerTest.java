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
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TemaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoArchivarClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearTarea;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesAlumno;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesDocente;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTareas;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTemas;

@ExtendWith(MockitoExtension.class)
class ClaseControllerTest {

    @Mock private CasoUsoCrearClase casoUsoCrearClase;
    @Mock private CasoUsoArchivarClase casoUsoArchivarClase;
    @Mock private CasoUsoListarClasesDocente casoUsoListarClasesDocente;
    @Mock private CasoUsoListarClasesAlumno casoUsoListarClasesAlumno;
    @Mock private CasoUsoListarTareas casoUsoListarTareas;
    @Mock private CasoUsoCrearTarea casoUsoCrearTarea;
    @Mock private CasoUsoListarTemas casoUsoListarTemas;

    private ClaseController controller;

    @BeforeEach
    void setUp() {
        controller =
                new ClaseController(
                        casoUsoCrearClase,
                        casoUsoArchivarClase,
                        casoUsoListarClasesDocente,
                        casoUsoListarClasesAlumno,
                        casoUsoListarTareas,
                        casoUsoCrearTarea,
                        casoUsoListarTemas);
    }

    @Test
    void listarClasesComoDocente_retornaListaExitosa() {
        List<ClaseRespuesta> esperado =
                List.of(
                        ClaseRespuesta.builder()
                                .idClassroom("c-docente-1")
                                .nombre("Seminario Tesis I")
                                .estado(EstadoClase.ACTIVE)
                                .build());

        when(casoUsoListarClasesDocente.ejecutar()).thenReturn(esperado);

        ResponseEntity<ApiRespuesta<List<ClaseRespuesta>>> respuesta =
                controller.listarClasesComoDocente();

        assertEquals(200, respuesta.getStatusCode().value());
        assertNotNull(respuesta.getBody());
        assertEquals(1, respuesta.getBody().getDatos().size());
        assertEquals("Seminario Tesis I", respuesta.getBody().getDatos().get(0).getNombre());
        verify(casoUsoListarClasesDocente).ejecutar();
    }

    @Test
    void listarTemas_retornaListaExitosaDeClase() {
        List<TemaRespuesta> esperado =
                List.of(
                        TemaRespuesta.builder()
                                .idTema("t-1")
                                .idClase("c-docente-1")
                                .nombre("Marco Teórico")
                                .build());

        when(casoUsoListarTemas.ejecutar("c-docente-1")).thenReturn(esperado);

        ResponseEntity<ApiRespuesta<List<TemaRespuesta>>> respuesta =
                controller.listarTemas("c-docente-1");

        assertEquals(200, respuesta.getStatusCode().value());
        assertNotNull(respuesta.getBody());
        assertEquals(1, respuesta.getBody().getDatos().size());
        assertEquals("Marco Teórico", respuesta.getBody().getDatos().get(0).getNombre());
        verify(casoUsoListarTemas).ejecutar("c-docente-1");
    }
}
