package pe.edu.ulasalle.sistemainvestigacion.controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioActividadesSeguimiento;

@RestController
@RequestMapping("/api/v1/actividades-seguimiento")
public class ActividadesSeguimientoController {

    private final ServicioActividadesSeguimiento servicioActividadesSeguimiento;

    public ActividadesSeguimientoController(
            ServicioActividadesSeguimiento servicioActividadesSeguimiento) {
        this.servicioActividadesSeguimiento = servicioActividadesSeguimiento;
    }

    @GetMapping
    public ResponseEntity<ApiRespuesta<List<TareaRespuesta>>> listarActividades() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                servicioActividadesSeguimiento.listarActividades());
    }

    @PostMapping("/sincronizar")
    public ResponseEntity<ApiRespuesta<List<TareaRespuesta>>> sincronizarActividades() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                servicioActividadesSeguimiento.sincronizarConClassroom());
    }
}
