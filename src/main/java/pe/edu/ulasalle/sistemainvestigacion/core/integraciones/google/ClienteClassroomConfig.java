package pe.edu.ulasalle.sistemainvestigacion.core.integraciones.google;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.classroom.Classroom;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClienteClassroomConfig {

    @Bean
    public Classroom googleClassroomClient() {
        return new Classroom.Builder(new NetHttpTransport(), new GsonFactory(), request -> {})
                .setApplicationName("SistemaInvestigacion")
                .build();
    }
}
