package pe.edu.ulasalle.sistemainvestigacion.core.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import io.jsonwebtoken.Claims;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ServicioJwtTest {

    private static final String CLAVE_SECRETA_PRUEBA =
            "claveSecretaParaPruebasUnitariasDebeTenerAlMenos256Bits123!";
    private static final long EXPIRACION_MILLIS = 3600000L;

    private ServicioJwt servicioJwt;

    @BeforeEach
    void setUp() {
        servicioJwt = new ServicioJwt(CLAVE_SECRETA_PRUEBA, EXPIRACION_MILLIS);
    }

    @Test
    void generarTokenAcceso_generaTokenValidoYContieneClaimsEsperados() {
        UUID idUsuario = UUID.randomUUID();
        String rol = ConstantesSeguridad.ROL_ADMIN;

        String token = servicioJwt.generarTokenAcceso(idUsuario, rol);

        assertNotNull(token);
        Claims claims = servicioJwt.obtenerPayload(token);
        assertNotNull(claims);
        assertEquals(idUsuario.toString(), claims.getSubject());
        assertEquals("acceso", claims.get("tipo", String.class));
        assertEquals(rol, claims.get("rol", String.class));
    }

    @Test
    void obtenerPayload_tokenInvalido_retornaNull() {
        assertNull(servicioJwt.obtenerPayload("tokenInvalido.Malformado.123"));
        assertNull(servicioJwt.obtenerPayload(null));
        assertNull(servicioJwt.obtenerPayload(""));
    }

    @Test
    void obtenerPayload_tokenExpirado_retornaNull() {
        ServicioJwt servicioJwtExpirado = new ServicioJwt(CLAVE_SECRETA_PRUEBA, -1000L);
        UUID idUsuario = UUID.randomUUID();

        String tokenExpirado =
                servicioJwtExpirado.generarTokenAcceso(idUsuario, ConstantesSeguridad.ROL_ADMIN);

        assertNull(servicioJwt.obtenerPayload(tokenExpirado));
    }
}
