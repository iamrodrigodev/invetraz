package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Configuration
public class ClienteClassroomConfig {

    private final String clientId;
    private final String clientSecret;
    private final String refreshToken;

    public ClienteClassroomConfig(
            @Value("${app.google.client-id}") String clientId,
            @Value("${app.google.client-secret}") String clientSecret,
            @Value("${app.google.refresh-token}") String refreshToken) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
    }

    @Bean
    public Classroom googleClassroomClient() {
        try {
            if (clientId == null || clientSecret == null || refreshToken == null) {
                throw new ExcepcionPersonalizada(
                        MensajesDeError.ERROR_CREDENCIALES_GOOGLE_NO_ENCONTRADAS.getMensaje(), 500);
            }

            GoogleCredentials credentials =
                    UserCredentials.newBuilder()
                            .setClientId(clientId)
                            .setClientSecret(clientSecret)
                            .setRefreshToken(refreshToken)
                            .build();

            NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

            return new Classroom.Builder(
                            httpTransport,
                            GsonFactory.getDefaultInstance(),
                            new HttpCredentialsAdapter(credentials))
                    .setApplicationName("SistemaDeInvestigacion")
                    .build();
        } catch (ExcepcionPersonalizada e) {
            throw e;
        } catch (Exception e) {
            throw new ExcepcionPersonalizada(
                    MensajesDeError.ERROR_CREDENCIALES_GOOGLE_INVALIDAS.getMensaje(), 500);
        }
    }
}
