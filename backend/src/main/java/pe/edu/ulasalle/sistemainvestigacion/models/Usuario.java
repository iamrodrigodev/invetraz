package pe.edu.ulasalle.sistemainvestigacion.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import pe.edu.ulasalle.sistemainvestigacion.core.constants.ValidationConstants;

@Entity
@Table(schema = "auth", name = "usuarios")
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = ValidationConstants.MAX_EMAIL)
    private String email;

    @Column(nullable = false, length = ValidationConstants.MAX_PASSWORD)
    private String password;

    protected Usuario() {}

    @Builder
    public Usuario(UUID id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}
