package pe.edu.ulasalle.sistemainvestigacion.core.security;

import java.util.Optional;
import java.util.UUID;

public interface IdentidadPort {
    record Identidad(UUID id, UUID rolId, String nombreRol) {}

    Optional<Identidad> buscarActiva(UUID id);
}


