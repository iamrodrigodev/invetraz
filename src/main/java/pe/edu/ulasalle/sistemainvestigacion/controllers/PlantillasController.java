package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.VincularCarpetaDrivePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.CarpetaPlantillasRespuestaDto;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioDrivePlantillas;

@RestController
@RequestMapping("/api/v1/plantillas")
public class PlantillasController {

    private final ServicioDrivePlantillas servicioDrivePlantillas;

    public PlantillasController(ServicioDrivePlantillas servicioDrivePlantillas) {
        this.servicioDrivePlantillas = servicioDrivePlantillas;
    }

    @GetMapping
    public ResponseEntity<ApiRespuesta<CarpetaPlantillasRespuestaDto>> obtenerPlantillas() {
        CarpetaPlantillasRespuestaDto respuesta =
                servicioDrivePlantillas.obtenerPlantillasConfiguradas();
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), respuesta);
    }

    @PostMapping("/carpeta")
    public ResponseEntity<ApiRespuesta<CarpetaPlantillasRespuestaDto>> vincularCarpeta(
            @Valid @RequestBody VincularCarpetaDrivePeticion peticion) {
        CarpetaPlantillasRespuestaDto respuesta =
                servicioDrivePlantillas.vincularCarpeta(peticion.carpetaUrlOId());
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), respuesta);
    }
}
