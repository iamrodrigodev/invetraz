package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearClasePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoArchivarClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearTarea;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClases;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTareas;

@Slf4j
@RestController
@RequestMapping("/api/v1/clases")
public class ClaseController {

    private final CasoUsoCrearClase casoUsoCrearClase;
    private final CasoUsoArchivarClase casoUsoArchivarClase;
    private final CasoUsoListarClases casoUsoListarClases;
    private final CasoUsoListarTareas casoUsoListarTareas;
    private final CasoUsoCrearTarea casoUsoCrearTarea;

    public ClaseController(
            CasoUsoCrearClase casoUsoCrearClase,
            CasoUsoArchivarClase casoUsoArchivarClase,
            CasoUsoListarClases casoUsoListarClases,
            CasoUsoListarTareas casoUsoListarTareas,
            CasoUsoCrearTarea casoUsoCrearTarea) {
        this.casoUsoCrearClase = casoUsoCrearClase;
        this.casoUsoArchivarClase = casoUsoArchivarClase;
        this.casoUsoListarClases = casoUsoListarClases;
        this.casoUsoListarTareas = casoUsoListarTareas;
        this.casoUsoCrearTarea = casoUsoCrearTarea;
    }

    @PostMapping
    public ResponseEntity<ApiRespuesta<ClaseRespuesta>> crearClase(
            @Valid @RequestBody CrearClasePeticion peticion) {
        log.info("Peticion para crear clase: {}", peticion.getNombre());
        return ApiRespuesta.creado(
                MensajeConfirmacion.RECURSO_CREADO.getMensaje(),
                casoUsoCrearClase.ejecutar(peticion));
    }

    @PatchMapping("/{id}/archivar")
    public ResponseEntity<ApiRespuesta<Void>> archivarClase(@PathVariable String id) {
        log.info("Peticion para archivar clase: {}", id);
        casoUsoArchivarClase.ejecutar(id);
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje());
    }

    @GetMapping
    public ResponseEntity<ApiRespuesta<List<ClaseRespuesta>>> listarClases() {
        log.info("Peticion para listar clases");
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), casoUsoListarClases.ejecutar());
    }

    @GetMapping("/{idClase}/tareas")
    public ResponseEntity<ApiRespuesta<List<TareaRespuesta>>> listarTareas(
            @PathVariable String idClase) {
        log.info("Peticion para listar tareas de la clase: {}", idClase);
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoListarTareas.ejecutar(idClase));
    }

    @PostMapping("/{idClase}/tareas")
    public ResponseEntity<ApiRespuesta<TareaRespuesta>> crearTarea(
            @PathVariable String idClase, @Valid @RequestBody CrearTareaPeticion peticion) {
        log.info("Peticion para crear tarea en clase {}: {}", idClase, peticion.getTitulo());
        return ApiRespuesta.creado(
                MensajeConfirmacion.RECURSO_CREADO.getMensaje(),
                casoUsoCrearTarea.ejecutar(idClase, peticion));
    }
}
