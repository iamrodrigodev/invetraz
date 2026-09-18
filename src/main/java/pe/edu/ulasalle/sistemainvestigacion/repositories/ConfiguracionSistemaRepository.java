package pe.edu.ulasalle.sistemainvestigacion.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.models.ConfiguracionSistema;

@Repository
public interface ConfiguracionSistemaRepository extends JpaRepository<ConfiguracionSistema, UUID> {}
