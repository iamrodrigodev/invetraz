package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioLimitadorIntentos;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.VerificarPasswordPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarPassword;

@Slf4j
@Service
public class VerificarPasswordImpl implements CasoUsoVerificarPassword {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ServicioLimitadorIntentos servicioLimitadorIntentos;

    public VerificarPasswordImpl(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            ServicioLimitadorIntentos servicioLimitadorIntentos) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.servicioLimitadorIntentos = servicioLimitadorIntentos;
    }

    @Override
    public void ejecutar(VerificarPasswordPeticion peticion) {
        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacion == null
                || !autenticacion.isAuthenticated()
                || autenticacion instanceof AnonymousAuthenticationToken
                || !(autenticacion.getPrincipal() instanceof UUID idUsuario)) {
            throw new ExcepcionPersonalizada(MensajesDeError.ACCESO_DENEGADO);
        }

        String claveRateLimit = "pwd:" + idUsuario;
        servicioLimitadorIntentos.comprobarBloqueo(
                claveRateLimit, MensajesDeError.DEMASIADOS_INTENTOS_CONTRASENA);

        Usuario usuario =
                usuarioRepository
                        .findById(idUsuario)
                        .orElseThrow(
                                () ->
                                        new ExcepcionPersonalizada(
                                                MensajesDeError.RECURSO_NO_ENCONTRADO));

        if (!passwordEncoder.matches(peticion.password(), usuario.getPassword())) {
            servicioLimitadorIntentos.registrarFallo(
                    claveRateLimit, 5, 60_000L, MensajesDeError.DEMASIADOS_INTENTOS_CONTRASENA);
            throw new ExcepcionDeNegocio(MensajesDeError.CONTRASENA_ACTUAL_INCORRECTA);
        }

        servicioLimitadorIntentos.limpiarIntentos(claveRateLimit);
    }
}
