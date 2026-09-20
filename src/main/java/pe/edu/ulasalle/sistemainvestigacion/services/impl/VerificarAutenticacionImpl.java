package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.UUID;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.VerificarAutenticacionRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarAutenticacion;

@Service
public class VerificarAutenticacionImpl implements CasoUsoVerificarAutenticacion {

    private final UsuarioRepository usuarioRepository;

    public VerificarAutenticacionImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public VerificarAutenticacionRespuesta ejecutar() {
        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();

        if (autenticacion == null
                || !autenticacion.isAuthenticated()
                || autenticacion instanceof AnonymousAuthenticationToken) {
            return new VerificarAutenticacionRespuesta(false, null);
        }

        String email = null;
        if (autenticacion.getPrincipal() instanceof UUID idUsuario) {
            Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
            if (usuario != null) {
                email = usuario.getEmail();
            }
        }

        return new VerificarAutenticacionRespuesta(true, email);
    }
}
