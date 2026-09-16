package pe.edu.ulasalle.sistemainvestigacion.controllers;

import java.net.URI;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RaizController {

    @GetMapping({"/", ""})
    public ResponseEntity<Void> redirigirAlEstado() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("/api/v1/estado"))
                .build();
    }
}
