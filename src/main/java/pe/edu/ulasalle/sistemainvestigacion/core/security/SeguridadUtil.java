package pe.edu.ulasalle.sistemainvestigacion.core.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

public final class SeguridadUtil {

    private static final SecureRandom RANDOM_SEGURO = new SecureRandom();

    private SeguridadUtil() {}

    public static UUID obtenerUsuarioIdRequerido() {
        return obtenerUsuarioActualId();
    }

    public static UUID obtenerUsuarioActualId() {
        return obtenerUsuarioActualIdOpcional()
                .orElseThrow(() -> new ExcepcionPersonalizada(MensajesDeError.NO_AUTORIZADO));
    }

    public static Optional<UUID> obtenerUsuarioActualIdOpcional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return Optional.empty();
        }
        return extraerUuid(auth.getPrincipal());
    }

    public static Optional<UUID> extraerUuid(Object principal) {
        if (principal instanceof UUID uuid) {
            return Optional.of(uuid);
        }
        if (principal instanceof String valor) {
            try {
                return Optional.of(UUID.fromString(valor));
            } catch (Exception e) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    public static String sha256(String texto) {
        if (texto == null) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(texto.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 no disponible", e);
        }
    }

    public static String generarTokenAleatorio(int longitudBytes) {
        byte[] bytes = new byte[longitudBytes];
        RANDOM_SEGURO.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    public static String extraerIpCliente(jakarta.servlet.http.HttpServletRequest solicitud) {
        if (solicitud == null) {
            return "0.0.0.0";
        }
        String direccionRemota = solicitud.getRemoteAddr();
        return direccionRemota != null ? direccionRemota : "0.0.0.0";
    }
}
