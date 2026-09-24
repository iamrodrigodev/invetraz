package pe.edu.ulasalle.sistemainvestigacion.core.startup;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioJwt;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioReadiness;

@ExtendWith(MockitoExtension.class)
class PrecalentadorAplicacionTest {

    @Mock private ServicioReadiness servicioReadiness;
    @Mock private ServicioJwt servicioJwt;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private ProveedorClassroom proveedorClassroom;
    @Mock private ProveedorDrive proveedorDrive;

    private PrecalentadorAplicacion precalentador;

    @BeforeEach
    void setUp() {
        precalentador =
                new PrecalentadorAplicacion(
                        servicioReadiness,
                        servicioJwt,
                        passwordEncoder,
                        usuarioRepository,
                        proveedorClassroom,
                        proveedorDrive);
    }

    @Test
    void deberiaEjecutarPrecalentamientoCompletoExitosamente() {
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertDoesNotThrow(() -> precalentador.precalentar());

        verify(servicioReadiness).verificar();
        verify(usuarioRepository).findByEmail("warmup@ulasalle.edu.pe");
        verify(passwordEncoder).encode("warmup-password");
        verify(passwordEncoder).matches("warmup-password", "encoded");
        verify(servicioJwt).generarTokenAcceso(any(UUID.class), anyString());
        verify(proveedorClassroom).precalentar();
        verify(proveedorDrive).precalentar();
    }

    @Test
    void deberiaManejarExcepcionSinInterrumpirArranque() {
        doThrow(new RuntimeException("Simulacion de fallo en readiness"))
                .when(servicioReadiness)
                .verificar();

        assertDoesNotThrow(() -> precalentador.precalentar());
    }
}
