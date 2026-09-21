package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioConfiguracion;

@RestController
@RequestMapping("/api/v1/configuracion")
public class ConfiguracionController {

    private final ServicioConfiguracion servicioConfiguracion;

    public ConfiguracionController(ServicioConfiguracion servicioConfiguracion) {
        this.servicioConfiguracion = servicioConfiguracion;
    }

    @GetMapping
    public ResponseEntity<ApiRespuesta<ActualizarCredencialesPeticion>> obtenerConfiguracion() {
        ActualizarCredencialesPeticion datos = servicioConfiguracion.obtenerConfiguracion();
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), datos);
    }

    @PostMapping
    public ResponseEntity<ApiRespuesta<Void>> actualizarConfiguracion(
            @Valid @RequestBody ActualizarCredencialesPeticion peticion) {
        servicioConfiguracion.actualizarConfiguracion(peticion);
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), null);
    }

    @PostMapping("/verificar")
    public ResponseEntity<ApiRespuesta<Map<String, Object>>> verificarConfiguracion(
            @RequestBody(required = false) ActualizarCredencialesPeticion peticion) {
        Map<String, Object> resultado = servicioConfiguracion.verificarConfiguracion(peticion);
        return ApiRespuesta.ok(
                "Conexión con Google Classroom verificada exitosamente", resultado);
    }
}
