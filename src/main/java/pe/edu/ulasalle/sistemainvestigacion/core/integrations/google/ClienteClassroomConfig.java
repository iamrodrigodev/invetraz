package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.ClassroomScopes;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Configuration
public class ClienteClassroomConfig {

    private static final List<String> SCOPES =
            Collections.singletonList(ClassroomScopes.CLASSROOM_COURSES);
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    @Bean
    public Classroom googleClassroomClient() {
        try {
            InputStream resourceStream = getClass().getResourceAsStream("/google-credentials.json");
            if (resourceStream == null) {
                throw new ExcepcionPersonalizada(
                        MensajesDeError.ERROR_CREDENCIALES_GOOGLE_NO_ENCONTRADAS.getMensaje(), 500);
            }

            GoogleClientSecrets clientSecrets =
                    GoogleClientSecrets.load(
                            GsonFactory.getDefaultInstance(),
                            new InputStreamReader(resourceStream, StandardCharsets.UTF_8));

            NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

            GoogleAuthorizationCodeFlow flow =
                    new GoogleAuthorizationCodeFlow.Builder(
                                    httpTransport,
                                    GsonFactory.getDefaultInstance(),
                                    clientSecrets,
                                    SCOPES)
                            .setDataStoreFactory(
                                    new FileDataStoreFactory(new File(TOKENS_DIRECTORY_PATH)))
                            .setAccessType("offline")
                            .build();

            LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
            Credential credential =
                    new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

            return new Classroom.Builder(
                            httpTransport, GsonFactory.getDefaultInstance(), credential)
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
