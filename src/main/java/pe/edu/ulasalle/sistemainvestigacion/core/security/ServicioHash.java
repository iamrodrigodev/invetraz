package pe.edu.ulasalle.sistemainvestigacion.core.security;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ServicioHash implements IServicioHash {

    private final PasswordEncoder codificadorArgon2 =
            new Argon2PasswordEncoder(16, 32, 1, 65536, 3);
    private final PasswordEncoder codificadorBcrypt = new BCryptPasswordEncoder();

    @Override
    public String hashear(String clave) {
        return codificadorArgon2.encode(clave);
    }

    @Override
    public boolean verificar(String clavePlana, String hashAlmacenado) {
        if (hashAlmacenado == null || clavePlana == null) {
            return false;
        }

        if (hashAlmacenado.startsWith("$argon2")) {
            try {
                return codificadorArgon2.matches(clavePlana, hashAlmacenado);
            } catch (Exception e) {
                return false;
            }
        }

        if (hashAlmacenado.startsWith("$2a$")
                || hashAlmacenado.startsWith("$2b$")
                || hashAlmacenado.startsWith("$2y$")) {
            try {
                return codificadorBcrypt.matches(clavePlana, hashAlmacenado);
            } catch (Exception e) {
                return false;
            }
        }

        return false;
    }
}


