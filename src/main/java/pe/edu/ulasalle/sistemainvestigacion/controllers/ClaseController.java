package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearClasePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoArchivarClase;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearClase;

@RestController
@RequestMapping("/api/v1/clases")
public class ClaseController {

    private final CasoUsoCrearClase casoUsoCrearClase;
    private final CasoUsoArchivarClase casoUsoArchivarClase;

    public ClaseController(
            CasoUsoCrearClase casoUsoCrearClase, CasoUsoArchivarClase casoUsoArchivarClase) {
        this.casoUsoCrearClase = casoUsoCrearClase;
        this.casoUsoArchivarClase = casoUsoArchivarClase;
    }

    @PostMapping
    public ResponseEntity<ApiRespuesta<ClaseRespuesta>> crearClase(
            @Valid @RequestBody CrearClasePeticion peticion) {
        return ApiRespuesta.creado(
                pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion
                        .RECURSO_CREADO
                        .getMensaje(),
                casoUsoCrearClase.ejecutar(peticion));
    }

    @PatchMapping("/{id}/archivar")
    public ResponseEntity<ApiRespuesta<Void>> archivarClase(@PathVariable String id) {
        casoUsoArchivarClase.ejecutar(id);
        return ApiRespuesta.ok(
                pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion
                        .OPERACION_EXITOSA
                        .getMensaje());
    }
}
