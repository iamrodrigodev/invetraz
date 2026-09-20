package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioCookie;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.VerificarAutenticacionRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoLogin;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarAutenticacion;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final CasoUsoLogin casoUsoLogin;
    private final CasoUsoVerificarAutenticacion casoUsoVerificarAutenticacion;
    private final ServicioCookie servicioCookie;

    @PostMapping("/login")
    public ResponseEntity<ApiRespuesta<LoginRespuesta>> iniciarSesion(
            @Valid @RequestBody LoginPeticion peticion) {

        LoginRespuesta respuesta = casoUsoLogin.ejecutar(peticion);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        servicioCookie.crearCookieAuth(respuesta.tokenAcceso()).toString())
                .body(
                        ApiRespuesta.exito(
                                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                                respuesta,
                                200));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiRespuesta<Void>> cerrarSesion() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, servicioCookie.crearCookieLimpieza().toString())
                .body(
                        ApiRespuesta.exito(
                                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), null, 200));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiRespuesta<VerificarAutenticacionRespuesta>> verificarAutenticacion() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoVerificarAutenticacion.ejecutar());
    }
}
