package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioLimitadorIntentos;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.VerificarPasswordPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class VerificarPasswordImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private ServicioLimitadorIntentos servicioLimitadorIntentos;
    private VerificarPasswordImpl servicio;

    @BeforeEach
    void setUp() {
        servicioLimitadorIntentos = new ServicioLimitadorIntentos();
        servicio =
                new VerificarPasswordImpl(
                        usuarioRepository, passwordEncoder, servicioLimitadorIntentos);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void ejecutar_sinAutenticacion_lanzaAccesoDenegado() {
        VerificarPasswordPeticion peticion = new VerificarPasswordPeticion("Clave123");

        ExcepcionPersonalizada ex =
                assertThrows(ExcepcionPersonalizada.class, () -> servicio.ejecutar(peticion));

        assertEquals(403, ex.getCodigo());
        assertEquals(MensajesDeError.ACCESO_DENEGADO.getMensaje(), ex.getMessage());
    }

    @Test
    void ejecutar_passwordValida_noLanzaExcepcion() {
        UUID idUsuario = UUID.randomUUID();
        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("admin@ulasalle.edu.pe")
                        .password("hash-actual")
                        .build();

        Authentication autenticacion = mock(Authentication.class);
        when(autenticacion.isAuthenticated()).thenReturn(true);
        when(autenticacion.getPrincipal()).thenReturn(idUsuario);
        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        when(usuarioRepository.findById(idUsuario)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("ClaveCorrecta123", "hash-actual")).thenReturn(true);

        VerificarPasswordPeticion peticion = new VerificarPasswordPeticion("ClaveCorrecta123");

        assertDoesNotThrow(() -> servicio.ejecutar(peticion));
    }

    @Test
    void ejecutar_passwordInvalida_lanzaExcepcionDeNegocio() {
        UUID idUsuario = UUID.randomUUID();
        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("admin@ulasalle.edu.pe")
                        .password("hash-actual")
                        .build();

        Authentication autenticacion = mock(Authentication.class);
        when(autenticacion.isAuthenticated()).thenReturn(true);
        when(autenticacion.getPrincipal()).thenReturn(idUsuario);
        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        when(usuarioRepository.findById(idUsuario)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("ClaveErrada", "hash-actual")).thenReturn(false);

        VerificarPasswordPeticion peticion = new VerificarPasswordPeticion("ClaveErrada");

        ExcepcionDeNegocio ex =
                assertThrows(ExcepcionDeNegocio.class, () -> servicio.ejecutar(peticion));

        assertEquals(MensajesDeError.CONTRASENA_ACTUAL_INCORRECTA.getMensaje(), ex.getMessage());
    }

    @Test
    void ejecutar_demasiadosIntentos_lanzaExcepcion429() {
        UUID idUsuario = UUID.randomUUID();
        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("admin@ulasalle.edu.pe")
                        .password("hash-actual")
                        .build();

        Authentication autenticacion = mock(Authentication.class);
        when(autenticacion.isAuthenticated()).thenReturn(true);
        when(autenticacion.getPrincipal()).thenReturn(idUsuario);
        SecurityContextHolder.getContext().setAuthentication(autenticacion);

        when(usuarioRepository.findById(idUsuario)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("ClaveErrada", "hash-actual")).thenReturn(false);

        VerificarPasswordPeticion peticion = new VerificarPasswordPeticion("ClaveErrada");

        for (int i = 0; i < 4; i++) {
            assertThrows(ExcepcionDeNegocio.class, () -> servicio.ejecutar(peticion));
        }

        ExcepcionPersonalizada ex =
                assertThrows(ExcepcionPersonalizada.class, () -> servicio.ejecutar(peticion));

        assertEquals(429, ex.getCodigo());
        assertEquals(
                MensajesDeError.DEMASIADOS_INTENTOS_CONTRASENA.getMensaje(), ex.getMessage());
    }
}
