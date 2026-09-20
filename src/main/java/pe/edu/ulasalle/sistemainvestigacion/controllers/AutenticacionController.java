package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioCookie;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CambiarPasswordPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.VerificarPasswordPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.VerificarAutenticacionRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCambiarPassword;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoLogin;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarAutenticacion;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarPassword;

@RestController
@RequestMapping("/api/v1/auth")
public class AutenticacionController {

    private final CasoUsoLogin casoUsoLogin;
    private final CasoUsoVerificarAutenticacion casoUsoVerificarAutenticacion;
    private final CasoUsoVerificarPassword casoUsoVerificarPassword;
    private final CasoUsoCambiarPassword casoUsoCambiarPassword;
    private final ServicioCookie servicioCookie;

    public AutenticacionController(
            CasoUsoLogin casoUsoLogin,
            CasoUsoVerificarAutenticacion casoUsoVerificarAutenticacion,
            CasoUsoVerificarPassword casoUsoVerificarPassword,
            CasoUsoCambiarPassword casoUsoCambiarPassword,
            ServicioCookie servicioCookie) {
        this.casoUsoLogin = casoUsoLogin;
        this.casoUsoVerificarAutenticacion = casoUsoVerificarAutenticacion;
        this.casoUsoVerificarPassword = casoUsoVerificarPassword;
        this.casoUsoCambiarPassword = casoUsoCambiarPassword;
        this.servicioCookie = servicioCookie;
    }

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
                                MensajeConfirmacion.OPERACION_EXITOSA.getCodigo()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiRespuesta<Void>> cerrarSesion() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, servicioCookie.crearCookieLimpieza().toString())
                .body(
                        ApiRespuesta.exito(
                                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                                null,
                                MensajeConfirmacion.OPERACION_EXITOSA.getCodigo()));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiRespuesta<VerificarAutenticacionRespuesta>> verificarAutenticacion() {
        return ApiRespuesta.ok(
                MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                casoUsoVerificarAutenticacion.ejecutar());
    }

    @PostMapping("/verificar-password")
    public ResponseEntity<ApiRespuesta<Void>> verificarPassword(
            @Valid @RequestBody VerificarPasswordPeticion peticion) {
        casoUsoVerificarPassword.ejecutar(peticion);
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), null);
    }

    @PutMapping("/cambiar-password")
    public ResponseEntity<ApiRespuesta<Void>> cambiarPassword(
            @Valid @RequestBody CambiarPasswordPeticion peticion) {
        casoUsoCambiarPassword.ejecutar(peticion);
        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), null);
    }
}
