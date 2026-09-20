package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ConstantesSeguridad;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioJwt;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoLogin;

@Service
@RequiredArgsConstructor
public class LoginImpl implements CasoUsoLogin {

    private static final String HASH_FICTICIO =
            "$2a$10$wT8PZtqgGgQjYyQ0X6g7OuM8oQZl5W6J1G5S2Y7N8B9V0C1D2E3F4";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ServicioJwt servicioJwt;

    @Override
    public LoginRespuesta ejecutar(LoginPeticion peticion) {
        String emailNormalizado =
                peticion.email() != null
                        ? peticion.email().trim().toLowerCase(Locale.ROOT)
                        : "";

        Optional<Usuario> usuarioOpt =
                usuarioRepository.findByEmailIgnoreCase(emailNormalizado);

        if (usuarioOpt.isEmpty()) {
            passwordEncoder.matches(peticion.password(), HASH_FICTICIO);
            throw new ExcepcionDeNegocio(MensajesDeError.CREDENCIALES_INVALIDAS);
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(peticion.password(), usuario.getPassword())) {
            throw new ExcepcionDeNegocio(MensajesDeError.CREDENCIALES_INVALIDAS);
        }

        if (passwordEncoder.upgradeEncoding(usuario.getPassword())) {
            usuario.setPassword(passwordEncoder.encode(peticion.password()));
            usuarioRepository.save(usuario);
        }

        String token =
                servicioJwt.generarTokenAcceso(usuario.getId(), ConstantesSeguridad.ROL_ADMIN);

        return new LoginRespuesta(token);
    }
}
