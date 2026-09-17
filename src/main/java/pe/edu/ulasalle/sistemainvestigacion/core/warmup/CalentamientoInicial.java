package pe.edu.ulasalle.sistemainvestigacion.core.warmup;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesAlumno;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarClasesDocente;

@Slf4j
@Component
@ConditionalOnProperty(name = "app.warmup.enabled", havingValue = "true", matchIfMissing = true)
public class CalentamientoInicial {

    private final CasoUsoListarClasesDocente casoUsoListarClasesDocente;
    private final CasoUsoListarClasesAlumno casoUsoListarClasesAlumno;

    public CalentamientoInicial(
            CasoUsoListarClasesDocente casoUsoListarClasesDocente,
            CasoUsoListarClasesAlumno casoUsoListarClasesAlumno) {
        this.casoUsoListarClasesDocente = casoUsoListarClasesDocente;
        this.casoUsoListarClasesAlumno = casoUsoListarClasesAlumno;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void alIniciarAplicacion() {
        ejecutarCalentamiento();
    }

    private void ejecutarCalentamiento() {
        long tiempoInicio = System.currentTimeMillis();
        log.info("Iniciando warmup de integracion con Google Classroom");
        try {
            var clasesDocente = casoUsoListarClasesDocente.ejecutar();
            var clasesAlumno = casoUsoListarClasesAlumno.ejecutar();

            long duracion = System.currentTimeMillis() - tiempoInicio;
            log.info(
                    "Warmup completado exitosamente en {} ms (clases docente: {}, clases"
                            + " estudiante: {})",
                    duracion,
                    clasesDocente.size(),
                    clasesAlumno.size());
        } catch (Exception e) {
            long duracion = System.currentTimeMillis() - tiempoInicio;
            log.warn(
                    "Warmup de Google Classroom no completado tras {} ms: {}",
                    duracion,
                    e.getMessage());
        }
    }
}
