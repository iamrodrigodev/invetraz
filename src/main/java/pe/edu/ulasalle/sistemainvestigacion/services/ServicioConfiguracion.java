package pe.edu.ulasalle.sistemainvestigacion.services;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.ActualizarCredencialesPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@Slf4j
@Service
public class ServicioConfiguracion {

    private final ConfiguracionSistemaRepository configuracionRepository;
    private final ProveedorClassroom proveedorClassroom;
    private final ProveedorDrive proveedorDrive;

    public ServicioConfiguracion(
            ConfiguracionSistemaRepository configuracionRepository,
            ProveedorClassroom proveedorClassroom,
            ProveedorDrive proveedorDrive) {
        this.configuracionRepository = configuracionRepository;
        this.proveedorClassroom = proveedorClassroom;
        this.proveedorDrive = proveedorDrive;
    }

    @Transactional
    public ActualizarCredencialesPeticion obtenerConfiguracion() {
        var configOpt = configuracionRepository.findFirstByOrderByIdAsc();

        if (configOpt.isEmpty()) {
            return new ActualizarCredencialesPeticion("", "", "", null, null, false, false);
        }

        ConfiguracionSistema config = configOpt.get();
        boolean googleVerificado = Boolean.TRUE.equals(config.getGoogleVerificado());
        boolean driveVerificado = Boolean.TRUE.equals(config.getDriveVerificado());

        if (!googleVerificado && driveVerificado) {
            config.setDriveVerificado(false);
            configuracionRepository.save(config);
            driveVerificado = false;
        }

        return new ActualizarCredencialesPeticion(
                config.getGoogleClientId() != null ? config.getGoogleClientId() : "",
                config.getGoogleClientSecret() != null ? config.getGoogleClientSecret() : "",
                config.getGoogleRefreshToken() != null ? config.getGoogleRefreshToken() : "",
                config.getGoogleDriveFolderId(),
                config.getGoogleDriveFolderName(),
                googleVerificado,
                driveVerificado);
    }

    @Transactional
    public void actualizarConfiguracion(ActualizarCredencialesPeticion peticion) {
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

        boolean googleVerificado = Boolean.TRUE.equals(peticion.googleVerificado());
        config.setGoogleVerificado(googleVerificado);

        if (!googleVerificado) {
            config.setDriveVerificado(false);
        } else if (peticion.driveVerificado() != null) {
            config.setDriveVerificado(peticion.driveVerificado());
        }

        configuracionRepository.save(config);

        proveedorClassroom.invalidarCache();
        proveedorDrive.invalidarCache();
    }

    @Transactional
    public Map<String, Object> verificarConfiguracion(ActualizarCredencialesPeticion peticion) {
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
                throw new ExcepcionDeNegocio(MensajesDeError.NO_HAY_CREDENCIALES_GOOGLE);
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
            throw new ExcepcionDeNegocio(MensajesDeError.CREDENCIALES_GOOGLE_INCOMPLETAS);
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
                throw new ExcepcionDeNegocio(MensajesDeError.GOOGLE_TOKEN_ACCESO_INVALIDO);
            }

            ConfiguracionSistema config =
                    configuracionRepository
                            .findFirstByOrderByIdAsc()
                            .orElse(ConfiguracionSistema.builder().build());

            if (config.getId() == null) {
                config.setId(UUID.randomUUID());
            }

            config.setGoogleClientId(clientId);
            config.setGoogleClientSecret(clientSecret);
            config.setGoogleRefreshToken(refreshToken);
            config.setGoogleVerificado(true);
            configuracionRepository.save(config);

            proveedorClassroom.invalidarCache();
            proveedorDrive.invalidarCache();

            return Map.of(
                    "valido",
                    true,
                    "mensaje",
                    "Las credenciales son válidas y la conexión con Google fue exitosa");
        } catch (ExcepcionDeNegocio e) {
            throw e;
        } catch (Exception e) {
            throw new ExcepcionDeNegocio(resolverMensajeErrorGoogle(e));
        }
    }

    private MensajesDeError resolverMensajeErrorGoogle(Exception e) {
        String mensajeDetalle = e.getMessage() != null ? e.getMessage() : "";
        if (mensajeDetalle.contains("invalid_grant")) {
            return MensajesDeError.GOOGLE_REFRESH_TOKEN_INVALIDO;
        }
        if (mensajeDetalle.contains("invalid_client")
                || mensajeDetalle.contains("unauthorized_client")) {
            return MensajesDeError.GOOGLE_CLIENT_ID_O_SECRET_INVALIDO;
        }
        return MensajesDeError.ERROR_CONEXION_GOOGLE;
    }
}
