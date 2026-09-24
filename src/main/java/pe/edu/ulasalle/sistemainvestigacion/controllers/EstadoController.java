package pe.edu.ulasalle.sistemainvestigacion.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ReadinessRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioReadiness;

@RestController
@RequestMapping("/api/v1/estado")
public class EstadoController {

    private final ServicioReadiness servicioReadiness;

    public EstadoController(ServicioReadiness servicioReadiness) {
        this.servicioReadiness = servicioReadiness;
    }

    @GetMapping
    public ResponseEntity<ApiRespuesta<Void>> verificarEstado() {
        return ApiRespuesta.ok(MensajeConfirmacion.SISTEMA_OPERATIVO.getMensaje());
    }

    @GetMapping("/readiness")
    public ResponseEntity<ApiRespuesta<ReadinessRespuesta>> verificarReadiness() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.SISTEMA_LISTO.getMensaje(), servicioReadiness.verificar());
    }
}
