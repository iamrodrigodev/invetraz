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
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoArchivarClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearTarea;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesAlumno;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesDocente;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTareas;

@RestController
@RequestMapping("/api/v1/clases")
public class ClaseController {

    private final CasoUsoCrearClase casoUsoCrearClase;
    private final CasoUsoArchivarClase casoUsoArchivarClase;
    private final CasoUsoListarClasesDocente casoUsoListarClasesDocente;
    private final CasoUsoListarClasesAlumno casoUsoListarClasesAlumno;
    private final CasoUsoListarTareas casoUsoListarTareas;
    private final CasoUsoCrearTarea casoUsoCrearTarea;

    public ClaseController(
            CasoUsoCrearClase casoUsoCrearClase,
            CasoUsoArchivarClase casoUsoArchivarClase,
            CasoUsoListarClasesDocente casoUsoListarClasesDocente,
            CasoUsoListarClasesAlumno casoUsoListarClasesAlumno,
            CasoUsoListarTareas casoUsoListarTareas,
            CasoUsoCrearTarea casoUsoCrearTarea) {
        this.casoUsoCrearClase = casoUsoCrearClase;
        this.casoUsoArchivarClase = casoUsoArchivarClase;
        this.casoUsoListarClasesDocente = casoUsoListarClasesDocente;
        this.casoUsoListarClasesAlumno = casoUsoListarClasesAlumno;
        this.casoUsoListarTareas = casoUsoListarTareas;
        this.casoUsoCrearTarea = casoUsoCrearTarea;
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

    @GetMapping({"", "/", "/docente", "/propias"})
    public ResponseEntity<ApiRespuesta<List<ClaseRespuesta>>> listarClasesDocente() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoListarClasesDocente.ejecutar());
    }

    @GetMapping({"/alumno", "/inscritas"})
    public ResponseEntity<ApiRespuesta<List<ClaseRespuesta>>> listarClasesAlumno() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoListarClasesAlumno.ejecutar());
    }

    @GetMapping("/{idClase}/tareas")
    public ResponseEntity<ApiRespuesta<List<TareaRespuesta>>> listarTareas(
            @PathVariable String idClase) {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoListarTareas.ejecutar(idClase));
    }

    @PostMapping("/{idClase}/tareas")
    public ResponseEntity<ApiRespuesta<TareaRespuesta>> crearTarea(
            @PathVariable String idClase, @Valid @RequestBody CrearTareaPeticion peticion) {
        return ApiRespuesta.creado(
                MensajeConfirmacion.RECURSO_CREADO.getMensaje(),
                casoUsoCrearTarea.ejecutar(idClase, peticion));
    }
}
