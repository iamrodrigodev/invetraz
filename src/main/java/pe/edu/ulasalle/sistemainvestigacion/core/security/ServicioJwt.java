package pe.edu.ulasalle.sistemainvestigacion.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ServicioJwt {

    private final SecretKey claveSecreta;
    private final long tiempoExpiracionMillis;

    public ServicioJwt(
            @Value("${app.jwt.secret}") String secretoFirma,
            @Value("${app.jwt.expiration-ms:86400000}") long tiempoExpiracionMillis) {

        byte[] keyBytes;
        try {
            // Intentar decodificar como Base64 estándar
            keyBytes = Decoders.BASE64.decode(secretoFirma);
        } catch (DecodingException e) {
            // Si falla (ej. caracteres invalidos o plain text), usar los bytes de la cadena UTF-8
            keyBytes = secretoFirma.getBytes(StandardCharsets.UTF_8);
        }

        this.claveSecreta = Keys.hmacShaKeyFor(keyBytes);
        this.tiempoExpiracionMillis = tiempoExpiracionMillis;
    }

    public String generarTokenAcceso(UUID idUsuario, String rol) {
        long ahora = System.currentTimeMillis();
        return Jwts.builder()
                .subject(idUsuario.toString())
                .claim("tipo", "acceso")
                .claim("rol", rol)
                .issuedAt(new Date(ahora))
                .expiration(new Date(ahora + tiempoExpiracionMillis))
                .signWith(claveSecreta)
                .compact();
    }

    public Claims obtenerPayload(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(claveSecreta)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
