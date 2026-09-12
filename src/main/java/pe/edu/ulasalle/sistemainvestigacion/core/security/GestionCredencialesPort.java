package pe.edu.ulasalle.sistemainvestigacion.core.security;

import java.util.UUID;

public interface GestionCredencialesPort {

    void registrarCredencial(UUID usuarioId, String hashClave);

    boolean verificarClave(UUID usuarioId, String clavePlana);

    void cambiarClave(UUID usuarioId, String claveActual, String nuevaClave);

    void revocarSesiones(UUID usuarioId);
}
