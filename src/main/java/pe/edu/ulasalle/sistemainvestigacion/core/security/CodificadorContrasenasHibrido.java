package pe.edu.ulasalle.sistemainvestigacion.core.security;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class CodificadorContrasenasHibrido implements PasswordEncoder {

    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
    private final Argon2PasswordEncoder argon2 = new Argon2PasswordEncoder(16, 32, 1, 1024, 1);

    @Override
    public String encode(CharSequence rawPassword) {
        return bcrypt.encode(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (encodedPassword == null) {
            return false;
        }
        if (encodedPassword.startsWith("$argon2")) {
            return argon2.matches(rawPassword, encodedPassword);
        }
        return bcrypt.matches(rawPassword, encodedPassword);
    }

    @Override
    public boolean upgradeEncoding(String encodedPassword) {
        return encodedPassword != null && !encodedPassword.startsWith("$2");
    }
}
