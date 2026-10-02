package pe.edu.ulasalle.sistemainvestigacion.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.CacheClassroom;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.CarpetaPlantillasRespuestaDto;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.PlantillaXlsxDto;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.mapper.ActividadSeguimientoMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.ActividadSeguimiento;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ActividadSeguimientoRepository;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ClaseRepository;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;

@ExtendWith(MockitoExtension.class)
class ServicioActividadesSeguimientoTest {

    @Mock private ActividadSeguimientoRepository actividadRepository;
    @Mock private TareaRepository tareaRepository;
    @Mock private ClaseRepository claseRepository;
    @Mock private ServicioDrivePlantillas servicioDrivePlantillas;
    @Mock private CacheClassroom cacheClassroom;

    private ServicioActividadesSeguimiento servicio;

    @BeforeEach
    void setUp() {
        servicio =
                new ServicioActividadesSeguimiento(
                        actividadRepository,
                        tareaRepository,
                        claseRepository,
                        servicioDrivePlantillas,
                        cacheClassroom,
                        Mappers.getMapper(ActividadSeguimientoMapper.class));
    }

    @Test
    void listarActividades_cuandoNoHayRegistros_retornaListaVacia() {
        when(actividadRepository.findAllByEstadoNotOrderByFechaCreacionDesc(EstadoTarea.DELETED))
                .thenReturn(Collections.emptyList());

        List<TareaRespuesta> resultado = servicio.listarActividades();

        assertTrue(resultado.isEmpty());
    }

    @Test
    void listarActividades_retornaActividadesMapeadas() {
        ActividadSeguimiento actividad =
                ActividadSeguimiento.builder()
                        .id(UUID.randomUUID())
                        .idTareaClassroom("t-1")
                        .idClaseClassroom("c-1")
                        .nombreClase("Tesis I")
                        .idPlantillaDrive("p-1")
                        .nombrePlantilla("Matriz.xlsx")
                        .titulo("Entrega 1")
                        .estado(EstadoTarea.PUBLISHED)
                        .fechaCreacion(LocalDateTime.now())
                        .build();

        when(actividadRepository.findAllByEstadoNotOrderByFechaCreacionDesc(EstadoTarea.DELETED))
                .thenReturn(List.of(actividad));

        List<TareaRespuesta> resultado = servicio.listarActividades();

        assertEquals(1, resultado.size());
        assertEquals("t-1", resultado.get(0).getIdTarea());
        assertEquals("Tesis I", resultado.get(0).getNombreClase());
        assertEquals("Matriz.xlsx", resultado.get(0).getNombrePlantilla());
    }

    @Test
    void sincronizarConClassroom_actualizaExistentesYDescubreNuevasTareasConPlantilla() {
        ActividadSeguimiento registrada =
                ActividadSeguimiento.builder()
                        .id(UUID.randomUUID())
                        .idTareaClassroom("t-existente")
                        .idClaseClassroom("c-1")
                        .idPlantillaDrive("p-1")
                        .titulo("Titulo Antiguo")
                        .estado(EstadoTarea.PUBLISHED)
                        .build();

        ActividadSeguimiento eliminadaEnClassroom =
                ActividadSeguimiento.builder()
                        .id(UUID.randomUUID())
                        .idTareaClassroom("t-borrada")
                        .idClaseClassroom("c-1")
                        .idPlantillaDrive("p-1")
                        .titulo("Borrada")
                        .estado(EstadoTarea.PUBLISHED)
                        .build();

        when(actividadRepository.findAllByEstadoNotOrderByFechaCreacionDesc(EstadoTarea.DELETED))
                .thenReturn(List.of(registrada, eliminadaEnClassroom))
                .thenReturn(List.of(registrada));

        PlantillaXlsxDto plantillaDto =
                PlantillaXlsxDto.builder()
                        .id("p-1")
                        .nombre("Matriz Oficial.xlsx")
                        .enlaceWeb("https://drive.google.com/file/d/p-1")
                        .frecuenciaUso(1L)
                        .build();

        when(servicioDrivePlantillas.obtenerPlantillasConfiguradas())
                .thenReturn(
                        CarpetaPlantillasRespuestaDto.builder()
                                .carpetaConfigurada(true)
                                .carpetaId("folder-1")
                                .plantillas(List.of(plantillaDto))
                                .driveVerificado(true)
                                .build());

        when(claseRepository.listarPorDocente())
                .thenReturn(
                        List.of(
                                ClaseClassroom.builder()
                                        .idClassroom("c-1")
                                        .nombre("Seminario I")
                                        .build()));

        TareaClassroom remotaActualizada =
                TareaClassroom.builder()
                        .idTarea("t-existente")
                        .idClase("c-1")
                        .titulo("Titulo Actualizado")
                        .estado(EstadoTarea.PUBLISHED)
                        .idPlantilla("p-1")
                        .build();

        TareaClassroom remotaDescubierta =
                TareaClassroom.builder()
                        .idTarea("t-nueva-classroom")
                        .idClase("c-1")
                        .titulo("Nueva desde Classroom")
                        .estado(EstadoTarea.PUBLISHED)
                        .idPlantilla("p-1")
                        .build();

        when(tareaRepository.listarPorClase("c-1"))
                .thenReturn(List.of(remotaActualizada, remotaDescubierta));
        when(actividadRepository.findByIdTareaClassroom("t-nueva-classroom"))
                .thenReturn(Optional.empty());

        List<TareaRespuesta> resultado = servicio.sincronizarConClassroom();

        assertEquals("Titulo Actualizado", registrada.getTitulo());
        assertEquals(EstadoTarea.DELETED, eliminadaEnClassroom.getEstado());
        assertEquals(1, resultado.size());
        verify(cacheClassroom).invalidarTareas("c-1");
        verify(actividadRepository).save(registrada);
        verify(actividadRepository).save(eliminadaEnClassroom);
        verify(actividadRepository, org.mockito.Mockito.times(3))
                .save(any(ActividadSeguimiento.class));
    }
}
