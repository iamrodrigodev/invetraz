package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.EstadoSetupRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoObtenerEstadoSetup;

@Service
public class ObtenerEstadoSetupImpl implements CasoUsoObtenerEstadoSetup {

    private final UsuarioRepository usuarioRepository;
    private volatile boolean configurado = false;

    public ObtenerEstadoSetupImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public EstadoSetupRespuesta ejecutar() {
        if (configurado) {
            return new EstadoSetupRespuesta(true);
        }
        boolean estaConfigurado = usuarioRepository.count() > 0;
        if (estaConfigurado) {
            this.configurado = true;
        }
        return new EstadoSetupRespuesta(estaConfigurado);
    }
}
