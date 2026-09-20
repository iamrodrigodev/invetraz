package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.VerificarAutenticacionRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarAutenticacion;

@Service
@RequiredArgsConstructor
public class VerificarAutenticacionImpl implements CasoUsoVerificarAutenticacion {

    private final UsuarioRepository usuarioRepository;

    @Override
    public VerificarAutenticacionRespuesta ejecutar() {
        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
        boolean autenticado =
                autenticacion != null
                        && autenticacion.isAuthenticated()
                        && !(autenticacion instanceof AnonymousAuthenticationToken);

        String email = null;
        if (autenticado && autenticacion.getPrincipal() instanceof UUID idUsuario) {
            Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
            if (usuario != null) {
                email = usuario.getEmail();
            }
        }

        return new VerificarAutenticacionRespuesta(autenticado, email);
    }
}
