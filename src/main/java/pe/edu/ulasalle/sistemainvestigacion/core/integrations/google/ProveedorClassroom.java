package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.springframework.stereotype.Component;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;
import pe.edu.ulasalle.sistemainvestigacion.repositories.ConfiguracionSistemaRepository;

@Component
public class ProveedorClassroom {

    private final ConfiguracionSistemaRepository configuracionRepository;
    private volatile Classroom cachedClient;
    private final Lock lock = new ReentrantLock();

    public ProveedorClassroom(ConfiguracionSistemaRepository configuracionRepository) {
        this.configuracionRepository = configuracionRepository;
    }

    public Classroom obtenerCliente() {
        Classroom result = cachedClient;
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

    private Classroom construirNuevoCliente() {
        try {
            var configOpt = configuracionRepository.findAll().stream().findFirst();

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
                        request.setConnectTimeout(10000);
                        request.setReadTimeout(20000);
                    };

            NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

            this.cachedClient =
                    new Classroom.Builder(
                                    httpTransport,
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
