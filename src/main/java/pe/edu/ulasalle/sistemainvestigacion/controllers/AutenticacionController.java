package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoLogin;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AutenticacionController {

    private final CasoUsoLogin casoUsoLogin;

    @PostMapping("/login")
    public ResponseEntity<LoginRespuesta> iniciarSesion(
            @Valid @RequestBody LoginPeticion peticion) {
        return ResponseEntity.ok(casoUsoLogin.ejecutar(peticion));
    }
}
