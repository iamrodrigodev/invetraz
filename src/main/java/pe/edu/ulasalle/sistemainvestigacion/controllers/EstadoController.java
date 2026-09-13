package pe.edu.ulasalle.sistemainvestigacion.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;

@Slf4j
@RestController
@RequestMapping("/api/v1/estado")
public class EstadoController {

    @GetMapping
    public ResponseEntity<ApiRespuesta<Void>> verificarEstado() {
        log.info("Peticion para verificar estado del sistema");
        return ApiRespuesta.ok(MensajeConfirmacion.SISTEMA_OPERATIVO.getMensaje());
    }
}
