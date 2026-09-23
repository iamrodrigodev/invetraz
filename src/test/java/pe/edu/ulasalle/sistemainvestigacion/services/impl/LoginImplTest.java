package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionDeNegocio;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ConstantesSeguridad;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioJwt;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioLimitadorIntentos;
import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.Usuario;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class LoginImplTest {

    @Mock private UsuarioRepository usuarioRepository;

    @Mock private PasswordEncoder passwordEncoder;

    @Mock private ServicioJwt servicioJwt;

    private ServicioLimitadorIntentos servicioLimitadorIntentos;

    private LoginImpl loginService;

    @BeforeEach
    void setUp() {
        servicioLimitadorIntentos = new ServicioLimitadorIntentos();
        loginService =
                new LoginImpl(
                        usuarioRepository, passwordEncoder, servicioJwt, servicioLimitadorIntentos);
    }

    @Test
    void ejecutar_credencialesValidas_retornaTokenAcceso() {
        UUID idUsuario = UUID.randomUUID();
        String rawPassword = "Password123";
        String encodedPassword = "$2a$10$hashedpassword";
        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("admin@ulasalle.edu.pe")
                        .password(encodedPassword)
                        .build();

        when(usuarioRepository.findByEmail("admin@ulasalle.edu.pe"))
                .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(passwordEncoder.upgradeEncoding(encodedPassword)).thenReturn(false);
        when(servicioJwt.generarTokenAcceso(idUsuario, ConstantesSeguridad.ROL_ADMIN))
                .thenReturn("token-de-prueba");

        LoginPeticion peticion = new LoginPeticion("  Admin@ulasalle.edu.pe  ", rawPassword);
        LoginRespuesta respuesta = loginService.ejecutar(peticion);

        assertNotNull(respuesta);
        assertEquals("token-de-prueba", respuesta.tokenAcceso());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void ejecutar_usuarioNoExiste_lanzaExcepcionInmediatamente() {
        when(usuarioRepository.findByEmail("noexiste@ulasalle.edu.pe"))
                .thenReturn(Optional.empty());
        when(usuarioRepository.findByEmailIgnoreCase("noexiste@ulasalle.edu.pe"))
                .thenReturn(Optional.empty());

        LoginPeticion peticion = new LoginPeticion("noexiste@ulasalle.edu.pe", "ClaveInvalida123");

        ExcepcionDeNegocio excepcion =
                assertThrows(ExcepcionDeNegocio.class, () -> loginService.ejecutar(peticion));

        assertEquals(MensajesDeError.CREDENCIALES_INVALIDAS.getMensaje(), excepcion.getMessage());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(servicioJwt, never()).generarTokenAcceso(any(), anyString());
    }

    @Test
    void ejecutar_passwordInvalido_lanzaExcepcion() {
        UUID idUsuario = UUID.randomUUID();
        String encodedPassword = "$2a$10$hashedpassword";
        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("admin@ulasalle.edu.pe")
                        .password(encodedPassword)
                        .build();

        when(usuarioRepository.findByEmail("admin@ulasalle.edu.pe"))
                .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("ClaveErrada", encodedPassword)).thenReturn(false);

        LoginPeticion peticion = new LoginPeticion("admin@ulasalle.edu.pe", "ClaveErrada");

        ExcepcionDeNegocio excepcion =
                assertThrows(ExcepcionDeNegocio.class, () -> loginService.ejecutar(peticion));

        assertEquals(MensajesDeError.CREDENCIALES_INVALIDAS.getMensaje(), excepcion.getMessage());
        verify(servicioJwt, never()).generarTokenAcceso(any(), anyString());
    }

    @Test
    void ejecutar_upgradeEncodingNecesario_actualizaPasswordYRetornaToken() {
        UUID idUsuario = UUID.randomUUID();
        String rawPassword = "Password123";
        String legacyHash = "$argon2id$v=19$m=1024,t=1,p=1$oldhash";
        String nuevoBcrypt = "$2a$10$newhash";

        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("admin@ulasalle.edu.pe")
                        .password(legacyHash)
                        .build();

        when(usuarioRepository.findByEmail("admin@ulasalle.edu.pe"))
                .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(rawPassword, legacyHash)).thenReturn(true);
        when(passwordEncoder.upgradeEncoding(legacyHash)).thenReturn(true);
        when(passwordEncoder.encode(rawPassword)).thenReturn(nuevoBcrypt);
        when(servicioJwt.generarTokenAcceso(idUsuario, ConstantesSeguridad.ROL_ADMIN))
                .thenReturn("token-upgrade");

        LoginPeticion peticion = new LoginPeticion("admin@ulasalle.edu.pe", rawPassword);
        LoginRespuesta respuesta = loginService.ejecutar(peticion);

        assertNotNull(respuesta);
        assertEquals("token-upgrade", respuesta.tokenAcceso());
        assertEquals(nuevoBcrypt, usuario.getPassword());
        verify(usuarioRepository).saveAndFlush(usuario);
    }

    @Test
    void ejecutar_superaLimiteIntentos_lanzaExcepcion429() {
        when(usuarioRepository.findByEmail("bloqueado@ulasalle.edu.pe"))
                .thenReturn(Optional.empty());
        when(usuarioRepository.findByEmailIgnoreCase("bloqueado@ulasalle.edu.pe"))
                .thenReturn(Optional.empty());

        LoginPeticion peticion = new LoginPeticion("bloqueado@ulasalle.edu.pe", "ClaveErrada123");

        for (int i = 0; i < 4; i++) {
            assertThrows(ExcepcionDeNegocio.class, () -> loginService.ejecutar(peticion));
        }

        // El quinto intento debe superar el limite y lanzar ExcepcionPersonalizada (HTTP 429)
        pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada excepcion =
                assertThrows(
                        pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada
                                .class,
                        () -> loginService.ejecutar(peticion));

        assertEquals(429, excepcion.getCodigo());
        assertEquals(
                MensajesDeError.DEMASIADOS_INTENTOS_LOGIN.getMensaje(), excepcion.getMessage());

        // Intentos subsiguientes se bloquean inmediatamente
        assertThrows(
                pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada.class,
                () -> loginService.ejecutar(peticion));
    }

    @Test
    void ejecutar_usuarioAntiguoConEmailMixto_usaFallbackIgnoreCase() {
        UUID idUsuario = UUID.randomUUID();
        String rawPassword = "Password123";
        String encodedPassword = "$2a$10$hashedpassword";
        Usuario usuario =
                Usuario.builder()
                        .id(idUsuario)
                        .email("Admin@ulasalle.edu.pe")
                        .password(encodedPassword)
                        .build();

        when(usuarioRepository.findByEmail("admin@ulasalle.edu.pe")).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmailIgnoreCase("admin@ulasalle.edu.pe"))
                .thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(passwordEncoder.upgradeEncoding(encodedPassword)).thenReturn(false);
        when(servicioJwt.generarTokenAcceso(idUsuario, ConstantesSeguridad.ROL_ADMIN))
                .thenReturn("token-fallback");

        LoginPeticion peticion = new LoginPeticion("Admin@ulasalle.edu.pe", rawPassword);
        LoginRespuesta respuesta = loginService.ejecutar(peticion);

        assertEquals("token-fallback", respuesta.tokenAcceso());
        verify(usuarioRepository).findByEmail("admin@ulasalle.edu.pe");
        verify(usuarioRepository).findByEmailIgnoreCase("admin@ulasalle.edu.pe");
    }
}
