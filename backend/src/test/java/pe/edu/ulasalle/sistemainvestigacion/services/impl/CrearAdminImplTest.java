package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearAdminPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.EstadoSetupRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.UsuarioDTO;
import pe.edu.ulasalle.sistemainvestigacion.mapper.UsuarioMapper;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoObtenerEstadoSetup;

@ExtendWith(MockitoExtension.class)
class CrearAdminImplTest {

    @Mock private UsuarioRepository usuarioRepository;

    @Mock private CasoUsoObtenerEstadoSetup casoUsoObtenerEstadoSetup;

    @Mock private PasswordEncoder passwordEncoder;

    @Mock private UsuarioMapper usuarioMapper;

    @InjectMocks private CrearAdminImpl crearAdmin;

    @Test
    void cuandoYaExisteUsuario_lanzaExcepcionYNoGuarda() {
        when(usuarioRepository.count()).thenReturn(1L);

        CrearAdminPeticion peticion =
                new CrearAdminPeticion("admin@ulasalle.edu.pe", "Password123!");

        assertThrows(ExcepcionDeNegocio.class, () -> crearAdmin.ejecutar(peticion));

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void cuandoNoExisteUsuario_creaAdminConExito() {
        when(usuarioRepository.count()).thenReturn(0L);
        when(casoUsoObtenerEstadoSetup.ejecutar()).thenReturn(new EstadoSetupRespuesta(false));
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");

        Usuario usuarioGuardado =
                Usuario.builder()
                        .id(UUID.randomUUID())
                        .email("admin@ulasalle.edu.pe")
                        .password("encodedPassword")
                        .build();

        UsuarioDTO dtoEsperado = new UsuarioDTO(usuarioGuardado.getId(), "admin@ulasalle.edu.pe");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);
        when(usuarioMapper.toDto(usuarioGuardado)).thenReturn(dtoEsperado);

        CrearAdminPeticion peticion =
                new CrearAdminPeticion("admin@ulasalle.edu.pe", "Password123!");
        UsuarioDTO resultado = crearAdmin.ejecutar(peticion);

        assertNotNull(resultado);
        verify(usuarioRepository).save(any(Usuario.class));
    }
}
