package pe.edu.ulasalle.sistemainvestigacion.controllers;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.core.response.MensajeConfirmacion;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@RestController
@RequestMapping("/api/v1/configuracion")
public class ConfiguracionController {

    private final ConfiguracionSistemaRepository configuracionRepository;
    private final ProveedorClassroom proveedorClassroom;
    private final ProveedorDrive proveedorDrive;

    public ConfiguracionController(
            ConfiguracionSistemaRepository configuracionRepository,
            ProveedorClassroom proveedorClassroom,
            ProveedorDrive proveedorDrive) {
        this.configuracionRepository = configuracionRepository;
        this.proveedorClassroom = proveedorClassroom;
        this.proveedorDrive = proveedorDrive;
    }

    @GetMapping
    public ResponseEntity<ApiRespuesta<ActualizarCredencialesPeticion>> obtenerConfiguracion() {
        var configOpt = configuracionRepository.findFirstByOrderByIdAsc();

        if (configOpt.isEmpty()) {
            return ApiRespuesta.ok(
                    MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(),
                    new ActualizarCredencialesPeticion("", "", ""));
        }

        ConfiguracionSistema config = configOpt.get();
        ActualizarCredencialesPeticion datos =
                new ActualizarCredencialesPeticion(
                        config.getGoogleClientId() != null ? config.getGoogleClientId() : "",
                        config.getGoogleClientSecret() != null
                                ? config.getGoogleClientSecret()
                                : "",
                        config.getGoogleRefreshToken() != null
                                ? config.getGoogleRefreshToken()
                                : "",
                        config.getGoogleDriveFolderId(),
                        config.getGoogleDriveFolderName());

        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), datos);
    }

    @PostMapping
    public ResponseEntity<ApiRespuesta<Void>> actualizarConfiguracion(
            @Valid @RequestBody ActualizarCredencialesPeticion peticion) {
        ConfiguracionSistema config =
                configuracionRepository
                        .findFirstByOrderByIdAsc()
                        .orElse(ConfiguracionSistema.builder().build());

        if (config.getId() == null) {
            config.setId(UUID.randomUUID());
        }

        config.setGoogleClientId(peticion.googleClientId().trim());
        config.setGoogleClientSecret(peticion.googleClientSecret().trim());
        config.setGoogleRefreshToken(peticion.googleRefreshToken().trim());
        if (peticion.googleDriveFolderId() != null) {
            config.setGoogleDriveFolderId(peticion.googleDriveFolderId().trim());
        }
        if (peticion.googleDriveFolderName() != null) {
            config.setGoogleDriveFolderName(peticion.googleDriveFolderName().trim());
        }

        configuracionRepository.save(config);

        proveedorClassroom.invalidarCache();
        proveedorDrive.invalidarCache();

        return ApiRespuesta.ok(MensajeConfirmacion.OPERACION_EXITOSA.getMensaje(), null);
    }

    @PostMapping("/verificar")
    public ResponseEntity<ApiRespuesta<Map<String, Object>>> verificarConfiguracion(
            @RequestBody(required = false) ActualizarCredencialesPeticion peticion) {
        String clientId =
                peticion != null
                                && peticion.googleClientId() != null
                                && !peticion.googleClientId().isBlank()
                        ? peticion.googleClientId().trim()
                        : null;
        String clientSecret =
                peticion != null
                                && peticion.googleClientSecret() != null
                                && !peticion.googleClientSecret().isBlank()
                        ? peticion.googleClientSecret().trim()
                        : null;
        String refreshToken =
                peticion != null
                                && peticion.googleRefreshToken() != null
                                && !peticion.googleRefreshToken().isBlank()
                        ? peticion.googleRefreshToken().trim()
                        : null;

        if (clientId == null || clientSecret == null || refreshToken == null) {
            var configOpt = configuracionRepository.findFirstByOrderByIdAsc();
            if (configOpt.isEmpty()) {
                throw new ExcepcionDeNegocio(
                        "No hay credenciales de Google configuradas para verificar");
            }
            ConfiguracionSistema config = configOpt.get();
            clientId = config.getGoogleClientId();
            clientSecret = config.getGoogleClientSecret();
            refreshToken = config.getGoogleRefreshToken();
        }

        if (clientId == null
                || clientId.isBlank()
                || clientSecret == null
                || clientSecret.isBlank()
                || refreshToken == null
                || refreshToken.isBlank()) {
            throw new ExcepcionDeNegocio(
                    "Las credenciales de Google están incompletas. Debes ingresar Client ID, Client"
                            + " Secret y Refresh Token.");
        }

        try {
            GoogleCredentials credentials =
                    UserCredentials.newBuilder()
                            .setClientId(clientId)
                            .setClientSecret(clientSecret)
                            .setRefreshToken(refreshToken)
                            .build();

            credentials.refresh();
            AccessToken token = credentials.getAccessToken();
            if (token == null || token.getTokenValue() == null || token.getTokenValue().isBlank()) {
                throw new ExcepcionDeNegocio(
                        "Google no devolvió un token de acceso válido. Revisa el Refresh Token.");
            }

            return ApiRespuesta.ok(
                    "Conexión con Google Classroom verificada exitosamente",
                    Map.of(
                            "valido",
                            true,
                            "mensaje",
                            "Las credenciales son válidas y la conexión con Google fue exitosa"));
        } catch (ExcepcionDeNegocio e) {
            throw e;
        } catch (Exception e) {
            String mensajeDetalle = e.getMessage() != null ? e.getMessage() : "Error desconocido";
            if (mensajeDetalle.contains("invalid_grant")) {
                mensajeDetalle =
                        "El Refresh Token es inválido, ha expirado o fue revocado en Google Cloud.";
            } else if (mensajeDetalle.contains("invalid_client")
                    || mensajeDetalle.contains("unauthorized_client")) {
                mensajeDetalle = "El Client ID o Client Secret son incorrectos.";
            }
            throw new ExcepcionDeNegocio("Error al conectar con Google: " + mensajeDetalle);
        }
    }
}
