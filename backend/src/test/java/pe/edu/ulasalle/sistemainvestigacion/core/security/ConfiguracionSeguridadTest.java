package pe.edu.ulasalle.sistemainvestigacion.core.security;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;

class ConfiguracionSeguridadTest {

    @Test
    void corsConfigurationSource_recortaOrigenesConfigurados() {
        ConfiguracionSeguridad configuracion =
                new ConfiguracionSeguridad(
                        null, " https://front.example.com , http://localhost:5173 ");

        MockHttpServletRequest request =
                new MockHttpServletRequest("OPTIONS", "/api/v1/clases/1/tareas");
        CorsConfiguration cors =
                configuracion.corsConfigurationSource().getCorsConfiguration(request);

        assertNotNull(cors);
        assertTrue(cors.getAllowedOrigins().contains("https://front.example.com"));
        assertTrue(cors.getAllowedOrigins().contains("http://localhost:5173"));
        assertTrue(cors.getAllowedHeaders().contains("*"));
    }
}
