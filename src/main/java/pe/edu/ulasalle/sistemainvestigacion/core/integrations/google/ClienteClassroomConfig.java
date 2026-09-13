package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.ClassroomScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.gson.Gson;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Configuration
public class ClienteClassroomConfig {

    private final String usuarioDelegado;
    private final String projectId;
    private final String privateKeyId;
    private final String privateKey;
    private final String clientEmail;
    private final String clientId;

    public ClienteClassroomConfig(
            @Value("${app.google.usuario-delegado}") String usuarioDelegado,
            @Value("${app.google.project-id}") String projectId,
            @Value("${app.google.private-key-id}") String privateKeyId,
            @Value("${app.google.private-key}") String privateKey,
            @Value("${app.google.client-email}") String clientEmail,
            @Value("${app.google.client-id}") String clientId) {
        this.usuarioDelegado = usuarioDelegado;
        this.projectId = projectId;
        this.privateKeyId = privateKeyId;
        this.privateKey = privateKey;
        this.clientEmail = clientEmail;
        this.clientId = clientId;
    }

    @Bean
    public Classroom googleClassroomClient() {
        try {
            if (projectId == null || clientEmail == null || privateKey == null) {
                throw new ExcepcionPersonalizada(
                        MensajesDeError.ERROR_CREDENCIALES_GOOGLE_NO_ENCONTRADAS.getMensaje(), 500);
            }

            Map<String, Object> credencialesMap = new HashMap<>();
            credencialesMap.put("type", "service_account");
            credencialesMap.put("project_id", projectId);
            credencialesMap.put("private_key_id", privateKeyId);
            credencialesMap.put("private_key", privateKey.replace("\\n", "\n"));
            credencialesMap.put("client_email", clientEmail);
            credencialesMap.put("client_id", clientId);
            credencialesMap.put("auth_uri", "https://accounts.google.com/o/oauth2/auth");
            credencialesMap.put("token_uri", "https://oauth2.googleapis.com/token");
            credencialesMap.put(
                    "auth_provider_x509_cert_url", "https://www.googleapis.com/oauth2/v1/certs");

            String jsonString = new Gson().toJson(credencialesMap);
            InputStream stream =
                    new ByteArrayInputStream(jsonString.getBytes(StandardCharsets.UTF_8));

            GoogleCredentials credentials =
                    GoogleCredentials.fromStream(stream)
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
