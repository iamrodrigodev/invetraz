package pe.edu.ulasalle.sistemainvestigacion.core.security;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

class ServicioLimitadorIntentosTest {

    private ServicioLimitadorIntentos limitador;

    @BeforeEach
    void setUp() {
        limitador = new ServicioLimitadorIntentos();
    }

    @Test
    void comprobarBloqueo_sinIntentos_noLanzaExcepcion() {
        assertDoesNotThrow(
                () -> limitador.comprobarBloqueo("clave1", MensajesDeError.DEMASIADOS_INTENTOS_LOGIN));
    }

    @Test
    void registrarFallo_hastaLimite_lanzaExcepcion429EnElQuinto() {
        String clave = "test:user1";

        for (int i = 0; i < 4; i++) {
            limitador.registrarFallo(clave, 5, 60_000L, MensajesDeError.DEMASIADOS_INTENTOS_LOGIN);
        }

        ExcepcionPersonalizada ex =
                assertThrows(
                        ExcepcionPersonalizada.class,
                        () ->
                                limitador.registrarFallo(
                                        clave, 5, 60_000L, MensajesDeError.DEMASIADOS_INTENTOS_LOGIN));

        assertEquals(429, ex.getCodigo());
        assertEquals(MensajesDeError.DEMASIADOS_INTENTOS_LOGIN.getMensaje(), ex.getMessage());

        // Comprobar bloqueo tambien debe fallar
        assertThrows(
                ExcepcionPersonalizada.class,
                () -> limitador.comprobarBloqueo(clave, MensajesDeError.DEMASIADOS_INTENTOS_LOGIN));
    }

    @Test
    void limpiarIntentos_restableceContador() {
        String clave = "test:user2";

        for (int i = 0; i < 4; i++) {
            limitador.registrarFallo(clave, 5, 60_000L, MensajesDeError.DEMASIADOS_INTENTOS_CONTRASENA);
        }

        limitador.limpiarIntentos(clave);

        // Ahora no debe estar bloqueado y debe permitir nuevos fallos sin llegar a 5 inmediatamente
        assertDoesNotThrow(
                () ->
                        limitador.registrarFallo(
                                clave, 5, 60_000L, MensajesDeError.DEMASIADOS_INTENTOS_CONTRASENA));
    }
}
