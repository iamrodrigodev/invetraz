package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Slf4j
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
                log.error(
                        "Faltan las credenciales de Google Classroom en la configuracion del"
                                + " servidor");
                throw new ExcepcionPersonalizada(MensajesDeError.ERROR_CONFIGURACION_GOOGLE);
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
            log.error("Error al inicializar el cliente de Google Classroom", e);
            throw new ExcepcionPersonalizada(MensajesDeError.ERROR_CONFIGURACION_GOOGLE);
        }
    }
}
