package pe.edu.ulasalle.sistemainvestigacion.core.security;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class ConfiguracionSeguridad {

    private final FiltroAutenticacionJwt filtroAutenticacionJwt;
    private final List<String> origenesCors;

    public ConfiguracionSeguridad(
            FiltroAutenticacionJwt filtroAutenticacionJwt,
            @Value("${app.cors.origins}") String origenesCors) {
        this.filtroAutenticacionJwt = filtroAutenticacionJwt;
        this.origenesCors = Arrays.asList(origenesCors.split(","));
    }

    @Bean
    public SecurityFilterChain cadenaFiltrosSeguridad(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(
                        sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        autorizacion ->
                                autorizacion
                                        .requestMatchers("/api/v1/setup/**")
                                        .permitAll()
                                        .requestMatchers("/api/v1/auth/**")
                                        .permitAll()
                                        .anyRequest()
                                        .authenticated())
                .addFilterBefore(
                        filtroAutenticacionJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(origenesCors);
        configuration.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(
                Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public org.springframework.boot.web.servlet.FilterRegistrationBean<FiltroAutenticacionJwt>
            registroJwt() {
        var registro =
                new org.springframework.boot.web.servlet.FilterRegistrationBean<>(
                        filtroAutenticacionJwt);
        registro.setEnabled(false);
        return registro;
    }

    @Bean
    public PasswordEncoder codificadorClaves() {
        return org.springframework.security.crypto.argon2.Argon2PasswordEncoder
                .defaultsForSpringSecurity_v5_8();
    }
}
