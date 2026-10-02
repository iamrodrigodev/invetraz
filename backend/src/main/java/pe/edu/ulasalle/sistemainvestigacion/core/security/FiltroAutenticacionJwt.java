package pe.edu.ulasalle.sistemainvestigacion.core.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class FiltroAutenticacionJwt extends OncePerRequestFilter {

    private final ServicioJwt servicioJwt;

    public FiltroAutenticacionJwt(ServicioJwt servicioJwt) {
        this.servicioJwt = servicioJwt;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/v1/setup")
                || "/api/v1/auth/login".equals(path)
                || "/api/v1/auth/logout".equals(path);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest solicitud, HttpServletResponse respuesta, FilterChain cadenaFiltros)
            throws ServletException, IOException {

        String tokenJwt = null;

        if (solicitud.getCookies() != null) {
            for (Cookie cookie : solicitud.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    tokenJwt = cookie.getValue();
                    break;
                }
            }
        }

        if (tokenJwt == null) {
            String encabezadoAutorizacion = solicitud.getHeader(HttpHeaders.AUTHORIZATION);
            if (encabezadoAutorizacion != null && encabezadoAutorizacion.startsWith("Bearer ")) {
                tokenJwt = encabezadoAutorizacion.substring(7);
            }
        }

        if (tokenJwt == null) {
            cadenaFiltros.doFilter(solicitud, respuesta);
            return;
        }

        try {
            Claims cuerpoToken = servicioJwt.obtenerPayload(tokenJwt);

            if (cuerpoToken != null && "acceso".equals(cuerpoToken.get("tipo", String.class))) {
                String asuntoUsuario = cuerpoToken.getSubject();
                String rol = cuerpoToken.get("rol", String.class);

                if (asuntoUsuario != null
                        && rol != null
                        && SecurityContextHolder.getContext().getAuthentication() == null) {
                    autenticarUsuario(UUID.fromString(asuntoUsuario), rol, solicitud);
                }
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        cadenaFiltros.doFilter(solicitud, respuesta);
    }

    private void autenticarUsuario(UUID idUsuario, String rol, HttpServletRequest solicitud) {
        UsernamePasswordAuthenticationToken tokenAutenticacion =
                new UsernamePasswordAuthenticationToken(
                        idUsuario,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(rol)));

        tokenAutenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(solicitud));
        SecurityContextHolder.getContext().setAuthentication(tokenAutenticacion);
    }
}
