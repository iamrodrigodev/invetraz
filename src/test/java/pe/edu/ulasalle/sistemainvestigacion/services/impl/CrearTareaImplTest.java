package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.asincrono.ServicioTareasAsincrono;

@ExtendWith(MockitoExtension.class)
class CrearTareaImplTest {

    @Mock private TareaRepository tareaRepository;
    @Mock private ServicioTareasAsincrono servicioTareasAsincrono;

    private CrearTareaImpl crearTarea;

    @BeforeEach
    void setUp() {
        crearTarea = new CrearTareaImpl(tareaRepository, servicioTareasAsincrono);
    }

    @Test
    void deberiaCrearTareaDeFormaSincronaPorDefecto() {
        CrearTareaPeticion peticion = new CrearTareaPeticion();
        peticion.setTitulo("Actividad Sincrona");

        TareaClassroom guardada =
                TareaClassroom.builder()
                        .idTarea("t-sync-100")
                        .idClase("clase-1")
                        .titulo("Actividad Sincrona")
                        .estado(EstadoTarea.PUBLISHED)
                        .build();

        when(tareaRepository.guardar(eq("clase-1"), any(TareaClassroom.class)))
                .thenReturn(guardada);

        TareaRespuesta respuesta = crearTarea.ejecutar("clase-1", peticion);

        assertNotNull(respuesta);
        assertEquals("t-sync-100", respuesta.getIdTarea());
        assertEquals("Actividad Sincrona", respuesta.getTitulo());
        verify(tareaRepository).guardar(eq("clase-1"), any(TareaClassroom.class));
        verify(servicioTareasAsincrono, never()).ejecutarCreacionEnSegundoPlano(any(), any());
    }

    @Test
    void deberiaCrearTareaDeFormaAsincronaCuandoSeSolicita() {
        CrearTareaPeticion peticion = new CrearTareaPeticion();
        peticion.setTitulo("Actividad Asincrona");
        peticion.setAsincrono(true);

        TareaRespuesta respuesta = crearTarea.ejecutar("clase-1", peticion);

        assertNotNull(respuesta);
        assertEquals("clase-1", respuesta.getIdClase());
        assertEquals("Actividad Asincrona", respuesta.getTitulo());
        assertTrue(respuesta.getIdTarea().startsWith("async-"));
        verify(servicioTareasAsincrono)
                .ejecutarCreacionEnSegundoPlano(eq("clase-1"), any(TareaClassroom.class));
        verify(tareaRepository, never()).guardar(any(), any());
    }
}
