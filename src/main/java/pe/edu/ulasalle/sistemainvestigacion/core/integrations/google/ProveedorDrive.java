package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@Slf4j
@Component
public class ProveedorDrive {

    private static final NetHttpTransport HTTP_TRANSPORT;

    static {
        try {
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        } catch (Exception e) {
            throw new IllegalStateException(
                    "No se pudo inicializar el transporte HTTP de Google", e);
        }
    }

    private final ConfiguracionSistemaRepository configuracionRepository;
    private volatile Drive cachedClient;
    private final Lock lock = new ReentrantLock();

    public ProveedorDrive(ConfiguracionSistemaRepository configuracionRepository) {
        this.configuracionRepository = configuracionRepository;
    }

    public Drive obtenerCliente() {
        Drive result = cachedClient;
        if (result != null) {
            return result;
        }
        lock.lock();
        try {
            result = cachedClient;
            if (result == null) {
                result = construirNuevoCliente();
                cachedClient = result;
            }
            return result;
        } finally {
            lock.unlock();
        }
    }

    public void invalidarCache() {
        lock.lock();
        try {
            this.cachedClient = null;
        } finally {
            lock.unlock();
        }
    }

    private Drive construirNuevoCliente() {
        try {
            var configOpt = configuracionRepository.findFirstByOrderByIdAsc();

            if (configOpt.isEmpty()) {
                throw new ExcepcionPersonalizada(MensajesDeError.ERROR_CONFIGURACION_GOOGLE);
            }

            ConfiguracionSistema config = configOpt.get();

            if (config.getGoogleClientId() == null
                    || config.getGoogleClientId().isBlank()
                    || config.getGoogleClientSecret() == null
                    || config.getGoogleClientSecret().isBlank()
                    || config.getGoogleRefreshToken() == null
                    || config.getGoogleRefreshToken().isBlank()) {
                throw new ExcepcionPersonalizada(MensajesDeError.ERROR_CONFIGURACION_GOOGLE);
            }

            GoogleCredentials credentials =
                    UserCredentials.newBuilder()
                            .setClientId(config.getGoogleClientId())
                            .setClientSecret(config.getGoogleClientSecret())
                            .setRefreshToken(config.getGoogleRefreshToken())
                            .build();

            try {
                credentials.refreshIfExpired();
            } catch (Exception e) {
            }

            HttpCredentialsAdapter adapter = new HttpCredentialsAdapter(credentials);
            HttpRequestInitializer requestInitializer =
                    request -> {
                        adapter.initialize(request);
                        request.setConnectTimeout(5000);
                        request.setReadTimeout(15000);
                        request.setNumberOfRetries(2);
                        if (request.getHeaders() != null) {
                            request.getHeaders().set("Connection", "keep-alive");
                        }
                    };

            this.cachedClient =
                    new Drive.Builder(
                                    HTTP_TRANSPORT,
                                    GsonFactory.getDefaultInstance(),
                                    requestInitializer)
                            .setApplicationName("SistemaDeInvestigacion")
                            .build();

            return this.cachedClient;
        } catch (ExcepcionPersonalizada e) {
            throw e;
        } catch (Exception e) {
            throw new ExcepcionPersonalizada(MensajesDeError.ERROR_CONFIGURACION_GOOGLE);
        }
    }
}
