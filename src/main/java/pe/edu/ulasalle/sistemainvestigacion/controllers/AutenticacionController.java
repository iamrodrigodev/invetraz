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
    public ResponseEntity<LoginRespuesta> iniciarSesion(
            @Valid @RequestBody LoginPeticion peticion) {
        
        LoginRespuesta respuesta = casoUsoLogin.ejecutar(peticion);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, servicioCookie.crearCookieAuth(respuesta.tokenAcceso()).toString())
                .body(respuesta);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> cerrarSesion() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, servicioCookie.crearCookieLimpieza().toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<VerificarAutenticacionRespuesta> verificarAutenticacion() {
        return ResponseEntity.ok(casoUsoVerificarAutenticacion.ejecutar());
    }
}