package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.ClassroomScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import java.io.InputStream;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Configuration
public class ClienteClassroomConfig {

    @Bean
    public Classroom googleClassroomClient() {
        try {
            InputStream resourceStream = getClass().getResourceAsStream("/google-credentials.json");
            if (resourceStream == null) {
                throw new ExcepcionPersonalizada(
                        MensajesDeError.ERROR_CREDENCIALES_GOOGLE_NO_ENCONTRADAS.getMensaje(), 500);
            }

            GoogleCredentials credentials =
                    GoogleCredentials.fromStream(resourceStream)
                            .createScoped(Collections.singleton(ClassroomScopes.CLASSROOM_COURSES));

            return new Classroom.Builder(
                            new NetHttpTransport(),
                            new GsonFactory(),
                            new HttpCredentialsAdapter(credentials))
                    .setApplicationName("SistemaInvestigacion")
                    .build();
        } catch (ExcepcionPersonalizada e) {
            throw e;
        } catch (Exception e) {
            throw new ExcepcionPersonalizada(
                    MensajesDeError.ERROR_CREDENCIALES_GOOGLE_INVALIDAS.getMensaje(), 500);
        }
    }
}
