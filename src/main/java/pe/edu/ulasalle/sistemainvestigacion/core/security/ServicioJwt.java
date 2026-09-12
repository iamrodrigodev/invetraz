package pe.edu.ulasalle.sistemainvestigacion.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Slf4j
@Service
public class ServicioJwt {

    @Value("${app.jwt.secret:defaultSecretKeyWithAtLeast256BitsLengthForHS256}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-hours:24}")
    private int jwtExpirationHours;

    private SecretKey claveFirma;

    @PostConstruct
    public void init() {
        this.claveFirma = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generarToken(UUID usuarioId, UUID sesionId) {
        Instant ahora = Instant.now();
        Instant expiracion = ahora.plus(jwtExpirationHours, ChronoUnit.HOURS);

        JwtBuilder constructor =
                Jwts.builder()
                        .subject(usuarioId.toString())
                        .claim("tipo", "acceso")
                        .claim("sid", sesionId.toString())
                        .id(UUID.randomUUID().toString())
                        .issuedAt(Date.from(ahora))
                        .expiration(Date.from(expiracion));

        return constructor.signWith(claveFirma).compact();
    }

    public Claims obtenerPayload(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(claveFirma)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Token JWT rechazado: {}", e.getClass().getSimpleName());
            return null;
        }
    }
}
