package pe.edu.ulasalle.sistemainvestigacion.core.startup;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorDrive;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ConstantesSeguridad;
import pe.edu.ulasalle.sistemainvestigacion.core.security.ServicioJwt;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.ServicioReadiness;

@Slf4j
@Component
public class PrecalentadorAplicacion {

    private static final String PASSWORD_DUMMY = "warmup-password";

    private final ServicioReadiness servicioReadiness;
    private final ServicioJwt servicioJwt;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository usuarioRepository;
    private final ProveedorClassroom proveedorClassroom;
    private final ProveedorDrive proveedorDrive;

    public PrecalentadorAplicacion(
            ServicioReadiness servicioReadiness,
            ServicioJwt servicioJwt,
            PasswordEncoder passwordEncoder,
            UsuarioRepository usuarioRepository,
            ProveedorClassroom proveedorClassroom,
            ProveedorDrive proveedorDrive) {
        this.servicioReadiness = servicioReadiness;
        this.servicioJwt = servicioJwt;
        this.passwordEncoder = passwordEncoder;
        this.usuarioRepository = usuarioRepository;
        this.proveedorClassroom = proveedorClassroom;
        this.proveedorDrive = proveedorDrive;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void precalentar() {
        long inicio = System.currentTimeMillis();
        try {
            servicioReadiness.verificar();
            usuarioRepository.findByEmail("warmup@ulasalle.edu.pe");
            passwordEncoder.matches(PASSWORD_DUMMY, passwordEncoder.encode(PASSWORD_DUMMY));
            servicioJwt.generarTokenAcceso(
                    java.util.UUID.randomUUID(), ConstantesSeguridad.ROL_ADMIN);
            proveedorClassroom.precalentar();
            proveedorDrive.precalentar();
            log.info(
                    "Precalentamiento seguro completado en {} ms",
                    System.currentTimeMillis() - inicio);
        } catch (RuntimeException excepcion) {
            log.warn("No se pudo completar el precalentamiento seguro: {}", excepcion.getMessage());
        }
    }
}
