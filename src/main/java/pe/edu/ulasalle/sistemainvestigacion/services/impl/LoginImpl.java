package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ServicioJwt servicioJwt;

    @Override
    @Transactional
    public LoginRespuesta ejecutar(LoginPeticion peticion) {
        Usuario usuario = usuarioRepository.findByEmail(peticion.email());

        if (usuario == null
                || !passwordEncoder.matches(peticion.password(), usuario.getPassword())) {
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
