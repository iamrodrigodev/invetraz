package pe.edu.ulasalle.sistemainvestigacion.services;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

@ExtendWith(MockitoExtension.class)
class ServicioReadinessTest {

    @Mock private JdbcTemplate jdbcTemplate;

    @Test
    void verificar_retornaListoCuandoLaBaseResponde() {
        when(jdbcTemplate.queryForObject("select 1", Integer.class)).thenReturn(1);

        ServicioReadiness servicio = new ServicioReadiness(jdbcTemplate);

        assertTrue(servicio.verificar().listo());
    }

    @Test
    void verificar_retornaNoListoCuandoLaBaseRespondeValorInesperado() {
        when(jdbcTemplate.queryForObject("select 1", Integer.class)).thenReturn(0);

        ServicioReadiness servicio = new ServicioReadiness(jdbcTemplate);

        assertFalse(servicio.verificar().listo());
    }
}
