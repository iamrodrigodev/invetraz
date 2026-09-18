package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoLogin;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final CasoUsoLogin casoUsoLogin;

    @PostMapping("/login")
    public ResponseEntity<LoginRespuesta> iniciarSesion(
            @Valid @RequestBody LoginPeticion peticion) {
        LoginRespuesta respuesta = casoUsoLogin.ejecutar(peticion);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", respuesta.tokenAcceso())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(respuesta);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> cerrarSesion() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Boolean>> verificarAutenticacion() {
        return ResponseEntity.ok(Map.of("autenticado", true));
    }
}