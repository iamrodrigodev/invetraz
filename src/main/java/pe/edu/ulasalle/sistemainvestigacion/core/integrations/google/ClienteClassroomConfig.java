package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.ClassroomScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import java.io.InputStream;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Configuration
public class ClienteClassroomConfig {

    private final String usuarioDelegado;

    public ClienteClassroomConfig(@Value("${app.google.usuario-delegado}") String usuarioDelegado) {
        this.usuarioDelegado = usuarioDelegado;
    }

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
                            .createScoped(Collections.singleton(ClassroomScopes.CLASSROOM_COURSES))
                            .createDelegated(usuarioDelegado);

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
