package pe.edu.ulasalle.sistemainvestigacion.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ReadinessRespuesta;

@Service
public class ServicioReadiness {

    private final JdbcTemplate jdbcTemplate;

    public ServicioReadiness(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public ReadinessRespuesta verificar() {
        Integer resultado = jdbcTemplate.queryForObject("select 1", Integer.class);
        return ReadinessRespuesta.builder().listo(Integer.valueOf(1).equals(resultado)).build();
    }
}
