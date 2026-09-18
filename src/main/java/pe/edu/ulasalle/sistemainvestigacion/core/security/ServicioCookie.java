package pe.edu.ulasalle.sistemainvestigacion.core.security;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class ServicioCookie {

    private static final String NOMBRE_COOKIE = "jwt";
    private static final int DURACION_SEGUNDOS = 24 * 60 * 60;

    public ResponseCookie crearCookieAuth(String token) {
        return ResponseCookie.from(NOMBRE_COOKIE, token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(DURACION_SEGUNDOS)
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