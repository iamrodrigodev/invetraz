package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
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

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ServicioJwt servicioJwt;

    @Override
    public LoginRespuesta ejecutar(LoginPeticion peticion) {
        Usuario usuario = usuarioRepository.findByEmail(peticion.email());

        if (usuario == null
                || !passwordEncoder.matches(peticion.password(), usuario.getPassword())) {
            throw new ExcepcionDeNegocio(
                    "Credenciales invalidas. Revisa tu correo o contrasena.", 401);
        }

        String token =
                servicioJwt.generarTokenAcceso(usuario.getId(), ConstantesSeguridad.ROL_ADMIN);

        return new LoginRespuesta(token);
    }
}
