package pe.edu.ulasalle.sistemainvestigacion.core.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class FiltroRegistroPeticiones extends OncePerRequestFilter {

    private static final String CLAVE_RASTREO = "traceId";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long tiempoInicio = System.currentTimeMillis();
        String traceId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put(CLAVE_RASTREO, traceId);

        String metodo = request.getMethod();
        String uri = request.getRequestURI();

        log.info("Peticion HTTP entrante [{}] {} {}", traceId, metodo, uri);

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duracion = System.currentTimeMillis() - tiempoInicio;
            log.info(
                    "Peticion HTTP finalizada [{}] {} {} - Estado: {} ({} ms)",
                    traceId,
                    metodo,
                    uri,
                    response.getStatus(),
                    duracion);
            MDC.remove(CLAVE_RASTREO);
        }
    }
}
