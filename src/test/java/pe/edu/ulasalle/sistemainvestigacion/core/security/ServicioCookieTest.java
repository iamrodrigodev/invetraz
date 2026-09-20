package pe.edu.ulasalle.sistemainvestigacion.core.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;

class ServicioCookieTest {

    private static final long EXPIRACION_MILLIS = 7200000L; // 2 horas
    private ServicioCookie servicioCookie;

    @BeforeEach
    void setUp() {
        servicioCookie = new ServicioCookie(EXPIRACION_MILLIS);
    }

    @Test
    void crearCookieAuth_estableceParametrosSegurosYDuracionCorrecta() {
        String token = "jwt-token-prueba";
        ResponseCookie cookie = servicioCookie.crearCookieAuth(token);

        assertEquals("jwt", cookie.getName());
        assertEquals(token, cookie.getValue());
        assertEquals(7200, cookie.getMaxAge().getSeconds());
        assertTrue(cookie.isHttpOnly());
        assertTrue(cookie.isSecure());
        assertEquals("/", cookie.getPath());
        assertEquals("None", cookie.getSameSite());
    }

    @Test
    void crearCookieLimpieza_estableceMaxAgeCero() {
        ResponseCookie cookie = servicioCookie.crearCookieLimpieza();

        assertEquals("jwt", cookie.getName());
        assertEquals("", cookie.getValue());
        assertEquals(0, cookie.getMaxAge().getSeconds());
        assertTrue(cookie.isHttpOnly());
        assertTrue(cookie.isSecure());
        assertEquals("/", cookie.getPath());
        assertEquals("None", cookie.getSameSite());
    }
}
