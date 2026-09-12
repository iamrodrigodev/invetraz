package pe.edu.ulasalle.sistemainvestigacion.core.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.time.Instant;
import java.time.LocalDateTime;

@Slf4j
@Component
public class FiltroAutenticacionJwt extends OncePerRequestFilter {

    private final SesionVigentePort sesiones;
    private final ServicioJwt servicioJwt;
    private final IdentidadPort usuarioRepository;
    private static final Pattern PATRON_CAMEL_CASE = Pattern.compile("([a-z])([A-Z])");

    public FiltroAutenticacionJwt(
            ServicioJwt servicioJwt,
            IdentidadPort usuarioRepository,
            SesionVigentePort sesiones) {
        this.sesiones = sesiones;
        this.servicioJwt = servicioJwt;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest solicitud,
            @NonNull HttpServletResponse respuesta,
            @NonNull FilterChain cadenaFiltros)
            throws ServletException, IOException {

        final String encabezadoAutorizacion = solicitud.getHeader(HttpHeaders.AUTHORIZATION);

        if (encabezadoAutorizacion == null || !encabezadoAutorizacion.startsWith("Bearer ")) {
            cadenaFiltros.doFilter(solicitud, respuesta);
            return;
        }

        final String tokenJwt = encabezadoAutorizacion.substring(7);
        try {
            Claims cuerpoToken = servicioJwt.obtenerPayload(tokenJwt);

            if (cuerpoToken != null && "acceso".equals(cuerpoToken.get("tipo", String.class))) {
                String asuntoUsuario = cuerpoToken.getSubject();
                if (asuntoUsuario != null
                        && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                    Optional<UUID> idUsuarioOpt = parseUuid(asuntoUsuario);
                    if (idUsuarioOpt.isPresent()) {
                        UUID idUsuario = idUsuarioOpt.get();
                        String sid = cuerpoToken.get("sid", String.class);
                        Optional<UUID> idSesionOpt = parseUuid(sid);
                        
                        if (idSesionOpt.isPresent()) {
                            UUID idSesion = idSesionOpt.get();
                            if (sesiones.vigente(idSesion, idUsuario, LocalDateTime.now())) {
                                autenticarUsuario(idUsuario, solicitud);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error authenticating JWT token", e);
        }

        cadenaFiltros.doFilter(solicitud, respuesta);
    }

    private Optional<UUID> parseUuid(String uuidStr) {
        if (uuidStr == null) return Optional.empty();
        try {
            return Optional.of(UUID.fromString(uuidStr));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private void autenticarUsuario(UUID idUsuario, HttpServletRequest solicitud) {
        IdentidadPort.Identidad usuario = usuarioRepository.buscarActiva(idUsuario).orElse(null);
        if (usuario == null) {
            return;
        }
        Set<GrantedAuthority> autoridades = construirAutoridades(usuario);
        UsernamePasswordAuthenticationToken tokenAutenticacion =
                new UsernamePasswordAuthenticationToken(idUsuario, null, autoridades);
        tokenAutenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(solicitud));
        SecurityContextHolder.getContext().setAuthentication(tokenAutenticacion);

        MDC.put("usuarioId", idUsuario.toString());
    }

    private Set<GrantedAuthority> construirAutoridades(IdentidadPort.Identidad usuario) {
        Set<GrantedAuthority> autoridades = new HashSet<>();
        if (usuario.nombreRol() != null) {
            autoridades.add(
                    new SimpleGrantedAuthority("ROLE_" + normalizarRol(usuario.nombreRol())));
        }
        return Set.copyOf(autoridades);
    }

    private String normalizarRol(String nombreRol) {
        String normalizado =
                PATRON_CAMEL_CASE
                        .matcher(nombreRol.trim())
                        .replaceAll("$1_$2")
                        .replace('-', '_')
                        .replace(' ', '_')
                        .toUpperCase(Locale.ROOT);
        if ("SUPERADMIN".equals(normalizado)) {
            return "SUPER_ADMIN";
        }
        return normalizado;
    }
}

