package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.ClassroomScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClienteClassroomConfig {

    @Value("${app.google.credentials-json}")
    private String credentialsJson;

    @Bean
    public Classroom googleClassroomClient() {
        try {
            if (credentialsJson == null || credentialsJson.isBlank()) {
                throw new RuntimeException(
                        "Falta la propiedad app.google.credentials-json en el application.yml");
            }

            InputStream credentialsStream =
                    new ByteArrayInputStream(credentialsJson.getBytes(StandardCharsets.UTF_8));

            GoogleCredentials credentials =
                    GoogleCredentials.fromStream(credentialsStream)
                            .createScoped(Collections.singleton(ClassroomScopes.CLASSROOM_COURSES));

            return new Classroom.Builder(
                            new NetHttpTransport(),
                            new GsonFactory(),
                            new HttpCredentialsAdapter(credentials))
                    .setApplicationName("SistemaInvestigacion")
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error al configurar el cliente de Google Classroom", e);
        }
    }
}
