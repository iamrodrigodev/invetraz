package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import pe.edu.ulasalle.sistemainvestigacion.models.ClaseClassroom;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;

@Slf4j
@Component
public class CacheClassroom {

    private static final long TTL_MILLIS = 60_000L;

    private record EntradaCache<T>(T datos, long expiracionMs) {
        boolean estaVigente(long ahora) {
            return ahora < expiracionMs;
        }
    }

    private final Map<String, EntradaCache<List<ClaseClassroom>>> cacheClases =
            new ConcurrentHashMap<>();
    private final Map<String, EntradaCache<List<TareaClassroom>>> cacheTareas =
            new ConcurrentHashMap<>();

    public List<ClaseClassroom> obtenerClases(
            String clave, Supplier<List<ClaseClassroom>> cargador) {
        long ahora = System.currentTimeMillis();
        EntradaCache<List<ClaseClassroom>> existente = cacheClases.get(clave);
        if (existente != null && existente.estaVigente(ahora)) {
            log.debug("Cache hit para clases con clave '{}'", clave);
            return existente.datos();
        }

        EntradaCache<List<ClaseClassroom>> calculada =
                cacheClases.compute(
                        clave,
                        (k, actual) -> {
                            long tiempo = System.currentTimeMillis();
                            if (actual != null && actual.estaVigente(tiempo)) {
                                return actual;
                            }
                            log.debug(
                                    "Cache miss para clases con clave '{}', cargando desde Google",
                                    clave);
                            List<ClaseClassroom> datos = cargador.get();
                            List<ClaseClassroom> inmutable =
                                    datos != null
                                            ? Collections.unmodifiableList(datos)
                                            : Collections.emptyList();
                            return new EntradaCache<>(inmutable, tiempo + TTL_MILLIS);
                        });

        return calculada != null ? calculada.datos() : Collections.emptyList();
    }

    public List<TareaClassroom> obtenerTareas(
            String idClase, Supplier<List<TareaClassroom>> cargador) {
        long ahora = System.currentTimeMillis();
        EntradaCache<List<TareaClassroom>> existente = cacheTareas.get(idClase);
        if (existente != null && existente.estaVigente(ahora)) {
            log.debug("Cache hit para tareas de la clase '{}'", idClase);
            return existente.datos();
        }

        EntradaCache<List<TareaClassroom>> calculada =
                cacheTareas.compute(
                        idClase,
                        (k, actual) -> {
                            long tiempo = System.currentTimeMillis();
                            if (actual != null && actual.estaVigente(tiempo)) {
                                return actual;
                            }
                            log.debug(
                                    "Cache miss para tareas de la clase '{}', cargando desde"
                                            + " Google",
                                    idClase);
                            List<TareaClassroom> datos = cargador.get();
                            List<TareaClassroom> inmutable =
                                    datos != null
                                            ? Collections.unmodifiableList(datos)
                                            : Collections.emptyList();
                            return new EntradaCache<>(inmutable, tiempo + TTL_MILLIS);
                        });

        return calculada != null ? calculada.datos() : Collections.emptyList();
    }

    public void invalidarClases() {
        log.debug("Invalidando cache de clases");
        cacheClases.clear();
    }

    public void invalidarTareas(String idClase) {
        log.debug("Invalidando cache de tareas para clase '{}'", idClase);
        cacheTareas.remove(idClase);
    }

    public void invalidarTodo() {
        log.debug("Invalidando toda la cache de Google Classroom");
        cacheClases.clear();
        cacheTareas.clear();
    }
}
