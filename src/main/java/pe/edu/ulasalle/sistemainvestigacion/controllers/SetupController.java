package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearAdminPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.EstadoSetupRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.UsuarioDTO;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearAdmin;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoObtenerEstadoSetup;

@RestController
@RequestMapping("/api/v1/setup")
@RequiredArgsConstructor
public class SetupController {

    private final CasoUsoObtenerEstadoSetup casoUsoObtenerEstadoSetup;
    private final CasoUsoCrearAdmin casoUsoCrearAdmin;

    @GetMapping("/estado")
    public ResponseEntity<ApiRespuesta<EstadoSetupRespuesta>> verificarEstado() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoObtenerEstadoSetup.ejecutar());
    }

    @PostMapping("/crear-admin")
    public ResponseEntity<ApiRespuesta<UsuarioDTO>> crearAdmin(
            @Valid @RequestBody CrearAdminPeticion peticion) {
        UsuarioDTO nuevoAdmin = casoUsoCrearAdmin.ejecutar(peticion);
        return ApiRespuesta.creado(MensajeConfirmacion.RECURSO_CREADO.getMensaje(), nuevoAdmin);
    }
}
