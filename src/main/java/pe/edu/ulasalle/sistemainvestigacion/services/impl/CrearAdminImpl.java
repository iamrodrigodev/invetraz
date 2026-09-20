package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearAdminPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.UsuarioDTO;
import pe.edu.ulasalle.sistemainvestigacion.mapper.UsuarioMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoCrearAdmin;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoObtenerEstadoSetup;

@Service
public class CrearAdminImpl implements CasoUsoCrearAdmin {

    private final UsuarioRepository usuarioRepository;
    private final CasoUsoObtenerEstadoSetup casoUsoObtenerEstadoSetup;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    public CrearAdminImpl(
            UsuarioRepository usuarioRepository,
            CasoUsoObtenerEstadoSetup casoUsoObtenerEstadoSetup,
            PasswordEncoder passwordEncoder,
            UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.casoUsoObtenerEstadoSetup = casoUsoObtenerEstadoSetup;
        this.passwordEncoder = passwordEncoder;
        this.usuarioMapper = usuarioMapper;
    }

    @Override
    public UsuarioDTO ejecutar(CrearAdminPeticion peticion) {
        if (usuarioRepository.count() > 0 || casoUsoObtenerEstadoSetup.ejecutar().configurado()) {
            throw new ExcepcionDeNegocio(
                    pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError
                            .ADMIN_YA_CONFIGURADO);
        }

        Usuario nuevoAdmin =
                Usuario.builder()
                        .email(peticion.email())
                        .password(passwordEncoder.encode(peticion.password()))
                        .build();

        Usuario adminGuardado = usuarioRepository.save(nuevoAdmin);

        return usuarioMapper.toDto(adminGuardado);
    }
}
