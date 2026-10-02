package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
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
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CambiarPasswordPeticion;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class CambiarPasswordImplTest {

    @Mock private UsuarioRepository usuarioRepository;

    @Mock private PasswordEncoder passwordEncoder;

    private ServicioLimitadorIntentos servicioLimitadorIntentos;
    private CambiarPasswordImpl servicio;

    @BeforeEach
    void setUp() {
        servicioLimitadorIntentos = new ServicioLimitadorIntentos();
        servicio =
                new CambiarPasswordImpl(
                        usuarioRepository, passwordEncoder, servicioLimitadorIntentos);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void ejecutar_sinAutenticacion_lanzaAccesoDenegado() {
        CambiarPasswordPeticion peticion =
                new CambiarPasswordPeticion("Actual123", "NuevaClave123");

        ExcepcionPersonalizada ex =
                assertThrows(ExcepcionPersonalizada.class, () -> servicio.ejecutar(peticion));

        assertEquals(403, ex.getCodigo());
        assertEquals(MensajesDeError.ACCESO_DENEGADO.getMensaje(), ex.getMessage());
    }

    @Test
    void ejecutar_passwordActualInvalida_lanzaExcepcionDeNegocio() {
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
        when(passwordEncoder.matches("ActualErrada", "hash-actual")).thenReturn(false);

        CambiarPasswordPeticion peticion =
                new CambiarPasswordPeticion("ActualErrada", "NuevaClave123");

        ExcepcionDeNegocio ex =
                assertThrows(ExcepcionDeNegocio.class, () -> servicio.ejecutar(peticion));

        assertEquals(MensajesDeError.CONTRASENA_ACTUAL_INCORRECTA.getMensaje(), ex.getMessage());
    }

    @Test
    void ejecutar_passwordNuevaIdentica_lanzaExcepcionDeNegocio() {
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
        when(passwordEncoder.matches("MismaClave123", "hash-actual")).thenReturn(true);

        CambiarPasswordPeticion peticion =
                new CambiarPasswordPeticion("MismaClave123", "MismaClave123");

        ExcepcionDeNegocio ex =
                assertThrows(ExcepcionDeNegocio.class, () -> servicio.ejecutar(peticion));

        assertEquals(MensajesDeError.CONTRASENA_NUEVA_IGUAL.getMensaje(), ex.getMessage());
    }

    @Test
    void ejecutar_cambioValido_actualizaPasswordYGuarda() {
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
        when(passwordEncoder.matches("Actual123", "hash-actual")).thenReturn(true);
        when(passwordEncoder.matches("NuevaClave123", "hash-actual")).thenReturn(false);
        when(passwordEncoder.encode("NuevaClave123")).thenReturn("nuevo-hash-123");

        CambiarPasswordPeticion peticion =
                new CambiarPasswordPeticion("Actual123", "NuevaClave123");

        assertDoesNotThrow(() -> servicio.ejecutar(peticion));

        assertEquals("nuevo-hash-123", usuario.getPassword());
        verify(usuarioRepository).saveAndFlush(usuario);
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
        when(passwordEncoder.matches("ActualErrada", "hash-actual")).thenReturn(false);

        CambiarPasswordPeticion peticion =
                new CambiarPasswordPeticion("ActualErrada", "NuevaClave123");

        for (int i = 0; i < 4; i++) {
            assertThrows(ExcepcionDeNegocio.class, () -> servicio.ejecutar(peticion));
        }

        ExcepcionPersonalizada ex =
                assertThrows(ExcepcionPersonalizada.class, () -> servicio.ejecutar(peticion));

        assertEquals(429, ex.getCodigo());
        assertEquals(MensajesDeError.DEMASIADOS_INTENTOS_CONTRASENA.getMensaje(), ex.getMessage());
    }
}
