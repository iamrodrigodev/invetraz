package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.VerificarAutenticacionRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class VerificarAutenticacionImplTest {

    @Mock private UsuarioRepository usuarioRepository;

    private VerificarAutenticacionImpl servicio;

    @BeforeEach
    void setUp() {
        servicio = new VerificarAutenticacionImpl(usuarioRepository);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void ejecutar_usuarioAutenticado_retornaAutenticadoTrueConEmail() {
        UUID idUsuario = UUID.randomUUID();
        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("admin@ulasalle.edu.pe")
                        .password("hash")
                        .build();

        Authentication autenticacion = mock(Authentication.class);
        when(autenticacion.isAuthenticated()).thenReturn(true);
        when(autenticacion.getPrincipal()).thenReturn(idUsuario);
        when(usuarioRepository.findById(idUsuario)).thenReturn(Optional.of(usuario));

        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        VerificarAutenticacionRespuesta respuesta = servicio.ejecutar();

        assertTrue(respuesta.autenticado());
        assertEquals("admin@ulasalle.edu.pe", respuesta.email());
    }

    @Test
    void ejecutar_sinAutenticacion_retornaAutenticadoFalse() {
        SecurityContextHolder.clearContext();

        VerificarAutenticacionRespuesta respuesta = servicio.ejecutar();

        assertFalse(respuesta.autenticado());
        assertNull(respuesta.email());
    }

    @Test
    void ejecutar_autenticacionAnonima_retornaAutenticadoFalse() {
        AnonymousAuthenticationToken anonymous =
                new AnonymousAuthenticationToken(
                        "key",
                        "anonymousUser",
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ANONYMOUS")));

        SecurityContextHolder.getContext().setAuthentication(anonymous);

        VerificarAutenticacionRespuesta respuesta = servicio.ejecutar();

        assertFalse(respuesta.autenticado());
        assertNull(respuesta.email());
    }

    @Test
    void ejecutar_noAutenticado_retornaAutenticadoFalse() {
        Authentication autenticacion = mock(Authentication.class);
        when(autenticacion.isAuthenticated()).thenReturn(false);

        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        VerificarAutenticacionRespuesta respuesta = servicio.ejecutar();

        assertFalse(respuesta.autenticado());
        assertNull(respuesta.email());
    }

    @Test
    void ejecutar_usuarioNoEncontradoEnBd_retornaAutenticadoFalse() {
        UUID idUsuario = UUID.randomUUID();
        Authentication autenticacion = mock(Authentication.class);
        when(autenticacion.isAuthenticated()).thenReturn(true);
        when(autenticacion.getPrincipal()).thenReturn(idUsuario);
        when(usuarioRepository.findById(idUsuario)).thenReturn(Optional.empty());

        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        VerificarAutenticacionRespuesta respuesta = servicio.ejecutar();

        assertFalse(respuesta.autenticado());
        assertNull(respuesta.email());
    }

    @Test
    void ejecutar_principalNoEsUuid_retornaAutenticadoFalse() {
        Authentication autenticacion = mock(Authentication.class);
        when(autenticacion.isAuthenticated()).thenReturn(true);
        when(autenticacion.getPrincipal()).thenReturn("stringNoUuid");

        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        VerificarAutenticacionRespuesta respuesta = servicio.ejecutar();

        assertFalse(respuesta.autenticado());
        assertNull(respuesta.email());
    }
}
