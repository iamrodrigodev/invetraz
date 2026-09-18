package pe.edu.ulasalle.sistemainvestigacion.controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@RestController
@RequestMapping("/api/v1/configuracion")
public class ConfiguracionController {

    private final ConfiguracionSistemaRepository configuracionRepository;
    private final ProveedorClassroom proveedorClassroom;

    public ConfiguracionController(
            ConfiguracionSistemaRepository configuracionRepository,
            ProveedorClassroom proveedorClassroom) {
        this.configuracionRepository = configuracionRepository;
        this.proveedorClassroom = proveedorClassroom;
    }

    @GetMapping
    public ResponseEntity<ActualizarCredencialesPeticion> obtenerConfiguracion() {
        var configOpt = configuracionRepository.findAll().stream().findFirst();

        if (configOpt.isEmpty()) {
            return ResponseEntity.ok(new ActualizarCredencialesPeticion("", "", ""));
        }

        ConfiguracionSistema config = configOpt.get();
        return ResponseEntity.ok(
                new ActualizarCredencialesPeticion(
                        config.getGoogleClientId() != null ? config.getGoogleClientId() : "",
                        config.getGoogleClientSecret() != null
                                ? config.getGoogleClientSecret()
                                : "",
                        config.getGoogleRefreshToken() != null
                                ? config.getGoogleRefreshToken()
                                : ""));
    }

    @PostMapping
    public ResponseEntity<Void> actualizarConfiguracion(
            @Valid @RequestBody ActualizarCredencialesPeticion peticion) {
        ConfiguracionSistema config =
                configuracionRepository.findAll().stream()
                        .findFirst()
                        .orElse(ConfiguracionSistema.builder().build());

        if (config.getId() == null) {
            config.setId(java.util.UUID.randomUUID());
        }

        config.setGoogleClientId(peticion.googleClientId());
        config.setGoogleClientSecret(peticion.googleClientSecret());
        config.setGoogleRefreshToken(peticion.googleRefreshToken());

        configuracionRepository.save(config);

        proveedorClassroom.invalidarCache();

        return ResponseEntity.ok().build();
    }
}
