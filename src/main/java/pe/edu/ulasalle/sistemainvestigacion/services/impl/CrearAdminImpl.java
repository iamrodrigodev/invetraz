package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class CrearAdminImpl implements CasoUsoCrearAdmin {

    private final UsuarioRepository usuarioRepository;
    private final CasoUsoObtenerEstadoSetup casoUsoObtenerEstadoSetup;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    @Override
    public UsuarioDTO ejecutar(CrearAdminPeticion peticion) {
        if (casoUsoObtenerEstadoSetup.ejecutar().configurado()) {
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
