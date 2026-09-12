package pe.edu.ulasalle.sistemainvestigacion.core.security;

import java.time.LocalDateTime;
import java.util.UUID;

public interface SesionVigentePort {
    boolean vigente(UUID sesionId, UUID usuarioId, LocalDateTime ahora);
}


