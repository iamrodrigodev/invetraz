package pe.edu.ulasalle.sistemainvestigacion.models;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import pe.edu.ulasalle.sistemainvestigacion.core.security.AttributeEncryptor;

@Entity
@Table(schema = "configuracion", name = "configuracion_sistema")
@Getter
@Setter
public class ConfiguracionSistema {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "google_client_id", length = 500)
    private String googleClientId;

    @Convert(converter = AttributeEncryptor.class)
    @Column(name = "google_client_secret", length = 1000)
    private String googleClientSecret;

    @Convert(converter = AttributeEncryptor.class)
    @Column(name = "google_refresh_token", length = 1000)
    private String googleRefreshToken;

    protected ConfiguracionSistema() {}

    @Builder
    public ConfiguracionSistema(
            UUID id, String googleClientId, String googleClientSecret, String googleRefreshToken) {
        this.id = id;
        this.googleClientId = googleClientId;
        this.googleClientSecret = googleClientSecret;
        this.googleRefreshToken = googleRefreshToken;
    }
}
