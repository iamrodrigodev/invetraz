package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.EstadoSetupRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoObtenerEstadoSetup;

@Service
public class ObtenerEstadoSetupImpl implements CasoUsoObtenerEstadoSetup {

    private final UsuarioRepository usuarioRepository;

    public ObtenerEstadoSetupImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public EstadoSetupRespuesta ejecutar() {
        return new EstadoSetupRespuesta(usuarioRepository.count() > 0);
    }
}
