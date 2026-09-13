package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import java.util.List;
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
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoArchivarClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClases;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTareas;

@RestController
@RequestMapping("/api/v1/clases")
public class ClaseController {

    private final CasoUsoCrearClase casoUsoCrearClase;
    private final CasoUsoArchivarClase casoUsoArchivarClase;
    private final CasoUsoListarClases casoUsoListarClases;
    private final CasoUsoListarTareas casoUsoListarTareas;

    public ClaseController(
            CasoUsoCrearClase casoUsoCrearClase,
            CasoUsoArchivarClase casoUsoArchivarClase,
            CasoUsoListarClases casoUsoListarClases,
            CasoUsoListarTareas casoUsoListarTareas) {
        this.casoUsoCrearClase = casoUsoCrearClase;
        this.casoUsoArchivarClase = casoUsoArchivarClase;
        this.casoUsoListarClases = casoUsoListarClases;
        this.casoUsoListarTareas = casoUsoListarTareas;
    }

    @PostMapping
    public ResponseEntity<ApiRespuesta<ClaseRespuesta>> crearClase(
            @Valid @RequestBody CrearClasePeticion peticion) {
        return ApiRespuesta.creado(
                MensajeConfirmacion.RECURSO_CREADO.getMensaje(),
                casoUsoCrearClase.ejecutar(peticion));
    }

    @PatchMapping("/{id}/archivar")
    public ResponseEntity<ApiRespuesta<Void>> archivarClase(@PathVariable String id) {
        casoUsoArchivarClase.ejecutar(id);
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje());
    }

    @GetMapping
    public ResponseEntity<ApiRespuesta<List<ClaseRespuesta>>> listarClases() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), casoUsoListarClases.ejecutar());
    }

    @GetMapping("/{idClase}/tareas")
    public ResponseEntity<ApiRespuesta<List<TareaRespuesta>>> listarTareas(
            @PathVariable String idClase) {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoListarTareas.ejecutar(idClase));
    }
}
