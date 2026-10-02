package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.Locale;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ConstantesSeguridad;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioJwt;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioLimitadorIntentos;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoLogin;

@Slf4j
@Service
public class LoginImpl implements CasoUsoLogin {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final ServicioJwt servicioJwt;
    private final ServicioLimitadorIntentos servicioLimitadorIntentos;

    public LoginImpl(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            ServicioJwt servicioJwt,
            ServicioLimitadorIntentos servicioLimitadorIntentos) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.servicioJwt = servicioJwt;
        this.servicioLimitadorIntentos = servicioLimitadorIntentos;
    }

    @Override
    @Transactional(readOnly = true)
    public LoginRespuesta ejecutar(LoginPeticion peticion) {
        long tInicio = System.currentTimeMillis();

        String emailNormalizado =
                peticion.email() != null ? peticion.email().trim().toLowerCase(Locale.ROOT) : "";

        String claveRateLimit = "login:" + emailNormalizado;
        servicioLimitadorIntentos.comprobarBloqueo(
                claveRateLimit, MensajesDeError.DEMASIADOS_INTENTOS_LOGIN);

        long t0 = System.currentTimeMillis();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(emailNormalizado);
        long tDb = System.currentTimeMillis() - t0;

        if (usuarioOpt.isEmpty()) {
            servicioLimitadorIntentos.registrarFallo(
                    claveRateLimit, 5, 60_000L, MensajesDeError.DEMASIADOS_INTENTOS_LOGIN);
            log.debug(
                    "Login fallido (usuario no encontrado): [{}] en {} ms (DB: {} ms)",
                    emailNormalizado,
                    System.currentTimeMillis() - tInicio,
                    tDb);
            throw new ExcepcionDeNegocio(MensajesDeError.CREDENCIALES_INVALIDAS);
        }

        Usuario usuario = usuarioOpt.get();

        long t1 = System.currentTimeMillis();
        if (!passwordEncoder.matches(peticion.password(), usuario.getPassword())) {
            long dHash = System.currentTimeMillis() - t1;
            servicioLimitadorIntentos.registrarFallo(
                    claveRateLimit, 5, 60_000L, MensajesDeError.DEMASIADOS_INTENTOS_LOGIN);
            log.debug(
                    "Login fallido (password incorrecto): [{}] en {} ms (DB: {} ms, Hash: {} ms)",
                    emailNormalizado,
                    System.currentTimeMillis() - tInicio,
                    tDb,
                    dHash);
            throw new ExcepcionDeNegocio(MensajesDeError.CREDENCIALES_INVALIDAS);
        }
        long tHash = System.currentTimeMillis() - t1;

        servicioLimitadorIntentos.limpiarIntentos(claveRateLimit);

        long t2 = System.currentTimeMillis();
        String token =
                servicioJwt.generarTokenAcceso(usuario.getId(), ConstantesSeguridad.ROL_ADMIN);
        long tJwt = System.currentTimeMillis() - t2;

        long tTotal = System.currentTimeMillis() - tInicio;
        log.info(
                "Login completado para [{}] en {} ms (DB: {} ms, Hash: {} ms, JWT: {} ms)",
                emailNormalizado,
                tTotal,
                tDb,
                tHash,
                tJwt);

        return new LoginRespuesta(token);
    }
}
