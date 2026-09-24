package pe.edu.ulasalle.sistemainvestigacion;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SistemaDeInvestigacion {

    @PostConstruct
    public void iniciar() {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
    }

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
        System.setProperty("user.timezone", "America/Lima");
        System.setProperty("java.net.preferIPv4Stack", "true");
        System.setProperty("java.net.preferIPv6Addresses", "false");
        System.setProperty("http.maxConnections", "30");
        System.setProperty("https.maxConnections", "30");
        SpringApplication.run(SistemaDeInvestigacion.class, args);
    }
}
