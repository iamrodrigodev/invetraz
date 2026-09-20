package pe.edu.ulasalle.sistemainvestigacion.core.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

class CodificadorContrasenasHibridoTest {

    private CodificadorContrasenasHibrido codificador;

    @BeforeEach
    void setUp() {
        codificador = new CodificadorContrasenasHibrido();
    }

    @Test
    void encode_generaHashBcrypt() {
        String rawPassword = "Password123!";
        String encoded = codificador.encode(rawPassword);

        assertTrue(encoded.startsWith("$2a$") || encoded.startsWith("$2b$"));
        assertTrue(codificador.matches(rawPassword, encoded));
        assertFalse(codificador.upgradeEncoding(encoded));
    }

    @Test
    void matches_soportaArgon2YRequiereUpgrade() {
        Argon2PasswordEncoder argonLegacy = new Argon2PasswordEncoder(16, 32, 1, 1024, 1);
        String rawPassword = "Password123!";
        String argonHash = argonLegacy.encode(rawPassword);

        assertTrue(argonHash.startsWith("$argon2"));
        assertTrue(codificador.matches(rawPassword, argonHash));
        assertTrue(codificador.upgradeEncoding(argonHash));
    }

    @Test
    void matches_passwordInvalido_retornaFalse() {
        String encoded = codificador.encode("CorrectPassword");

        assertFalse(codificador.matches("WrongPassword", encoded));
        assertFalse(codificador.matches("WrongPassword", null));
    }
}
