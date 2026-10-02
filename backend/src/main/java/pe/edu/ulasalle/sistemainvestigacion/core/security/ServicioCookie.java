package pe.edu.ulasalle.sistemainvestigacion.core.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class ServicioCookie {

    private static final String NOMBRE_COOKIE = "jwt";
    private final int duracionSegundos;

    public ServicioCookie(@Value("${app.jwt.expiration-ms}") long tiempoExpiracionMillis) {
        this.duracionSegundos = (int) (tiempoExpiracionMillis / 1000);
    }

    public ResponseCookie crearCookieAuth(String token) {
        return ResponseCookie.from(NOMBRE_COOKIE, token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(duracionSegundos)
                .sameSite("None")
                .build();
    }

    public ResponseCookie crearCookieLimpieza() {
        return ResponseCookie.from(NOMBRE_COOKIE, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
    }
}
