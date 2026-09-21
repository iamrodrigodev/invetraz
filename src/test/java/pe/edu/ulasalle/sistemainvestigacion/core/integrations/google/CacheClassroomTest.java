package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoClase;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;

class CacheClassroomTest {

    private CacheClassroom cache;

    @BeforeEach
    void setUp() {
        cache = new CacheClassroom();
    }

    @Test
    void deberiaCargarYReutilizarClasesSinVolverALlamarAlCargador() {
        AtomicInteger llamadas = new AtomicInteger(0);

        List<ClaseClassroom> clases =
                cache.obtenerClases(
                        "DOCENTE",
                        () -> {
                            llamadas.incrementAndGet();
                            return List.of(
                                    ClaseClassroom.builder()
                                            .idClassroom("c1")
                                            .nombre("Clase 1")
                                            .estado(EstadoClase.ACTIVE)
                                            .build());
                        });

        assertEquals(1, llamadas.get());
        assertEquals(1, clases.size());
        assertEquals("Clase 1", clases.get(0).getNombre());

        List<ClaseClassroom> clasesSegunda =
                cache.obtenerClases(
                        "DOCENTE",
                        () -> {
                            llamadas.incrementAndGet();
                            return new ArrayList<>();
                        });

        assertEquals(1, llamadas.get(), "No debio llamar al cargador en cache hit");
        assertEquals(1, clasesSegunda.size());
        assertEquals("c1", clasesSegunda.get(0).getIdClassroom());
    }

    @Test
    void deberiaInvalidarClasesCorrectamente() {
        AtomicInteger llamadas = new AtomicInteger(0);

        cache.obtenerClases(
                "DOCENTE",
                () -> {
                    llamadas.incrementAndGet();
                    return List.of(
                            ClaseClassroom.builder()
                                    .idClassroom("c1")
                                    .nombre("Clase 1")
                                    .estado(EstadoClase.ACTIVE)
                                    .build());
                });

        assertEquals(1, llamadas.get());

        cache.invalidarClases();

        cache.obtenerClases(
                "DOCENTE",
                () -> {
                    llamadas.incrementAndGet();
                    return List.of(
                            ClaseClassroom.builder()
                                    .idClassroom("c2")
                                    .nombre("Clase 2")
                                    .estado(EstadoClase.ACTIVE)
                                    .build());
                });

        assertEquals(2, llamadas.get(), "Debio recargar tras invalidar cache de clases");
    }

    @Test
    void deberiaCargarYReutilizarTareasPorClase() {
        AtomicInteger llamadas = new AtomicInteger(0);

        List<TareaClassroom> tareas =
                cache.obtenerTareas(
                        "clase100",
                        () -> {
                            llamadas.incrementAndGet();
                            return List.of(
                                    TareaClassroom.builder()
                                            .idTarea("t1")
                                            .idClase("clase100")
                                            .titulo("Tarea 1")
                                            .estado(EstadoTarea.PUBLISHED)
                                            .build());
                        });

        assertEquals(1, llamadas.get());
        assertEquals(1, tareas.size());

        List<TareaClassroom> tareasSegunda =
                cache.obtenerTareas(
                        "clase100",
                        () -> {
                            llamadas.incrementAndGet();
                            return new ArrayList<>();
                        });

        assertEquals(1, llamadas.get(), "No debio llamar al cargador en cache hit");
        assertEquals(1, tareasSegunda.size());
    }

    @Test
    void deberiaInvalidarTareasPorClaseEspecifica() {
        AtomicInteger llamadasClase1 = new AtomicInteger(0);
        AtomicInteger llamadasClase2 = new AtomicInteger(0);

        cache.obtenerTareas(
                "c1",
                () -> {
                    llamadasClase1.incrementAndGet();
                    return List.of(
                            TareaClassroom.builder()
                                    .idTarea("t1")
                                    .idClase("c1")
                                    .titulo("T1")
                                    .build());
                });

        cache.obtenerTareas(
                "c2",
                () -> {
                    llamadasClase2.incrementAndGet();
                    return List.of(
                            TareaClassroom.builder()
                                    .idTarea("t2")
                                    .idClase("c2")
                                    .titulo("T2")
                                    .build());
                });

        assertEquals(1, llamadasClase1.get());
        assertEquals(1, llamadasClase2.get());

        cache.invalidarTareas("c1");

        cache.obtenerTareas(
                "c1",
                () -> {
                    llamadasClase1.incrementAndGet();
                    return List.of(
                            TareaClassroom.builder()
                                    .idTarea("t1_nueva")
                                    .idClase("c1")
                                    .titulo("T1 Nueva")
                                    .build());
                });

        cache.obtenerTareas(
                "c2",
                () -> {
                    llamadasClase2.incrementAndGet();
                    return List.of();
                });

        assertEquals(2, llamadasClase1.get(), "Clase c1 debio recargarse");
        assertEquals(1, llamadasClase2.get(), "Clase c2 no debio recargarse");
    }

    @Test
    void deberiaInvalidarTodoCorrectamente() {
        AtomicInteger llamadasClases = new AtomicInteger(0);
        AtomicInteger llamadasTareas = new AtomicInteger(0);

        cache.obtenerClases(
                "DOCENTE",
                () -> {
                    llamadasClases.incrementAndGet();
                    return List.of(
                            ClaseClassroom.builder()
                                    .idClassroom("c1")
                                    .nombre("Clase")
                                    .estado(EstadoClase.ACTIVE)
                                    .build());
                });

        cache.obtenerTareas(
                "c1",
                () -> {
                    llamadasTareas.incrementAndGet();
                    return List.of(
                            TareaClassroom.builder()
                                    .idTarea("t1")
                                    .idClase("c1")
                                    .titulo("T1")
                                    .build());
                });

        assertEquals(1, llamadasClases.get());
        assertEquals(1, llamadasTareas.get());

        cache.invalidarTodo();

        cache.obtenerClases(
                "DOCENTE",
                () -> {
                    llamadasClases.incrementAndGet();
                    return List.of();
                });

        cache.obtenerTareas(
                "c1",
                () -> {
                    llamadasTareas.incrementAndGet();
                    return List.of();
                });

        assertEquals(2, llamadasClases.get());
        assertEquals(2, llamadasTareas.get());
    }

    @Test
    void listaRetornadaDebeSerInmutable() {
        List<ClaseClassroom> clases =
                cache.obtenerClases(
                        "DOCENTE",
                        () ->
                                new ArrayList<>(
                                        List.of(
                                                ClaseClassroom.builder()
                                                        .idClassroom("c1")
                                                        .nombre("Clase")
                                                        .estado(EstadoClase.ACTIVE)
                                                        .build())));

        assertNotNull(clases);
        assertThrows(
                UnsupportedOperationException.class,
                () ->
                        clases.add(
                                ClaseClassroom.builder()
                                        .idClassroom("c2")
                                        .nombre("Clase 2")
                                        .estado(EstadoClase.ACTIVE)
                                        .build()));
    }
}
