package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.VerificarAutenticacionRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarAutenticacion;

@Service
public class VerificarAutenticacionImpl implements CasoUsoVerificarAutenticacion {

    @Override
    public VerificarAutenticacionRespuesta ejecutar() {
        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
        boolean autenticado =
                autenticacion != null
                        && autenticacion.isAuthenticated()
                        && !(autenticacion instanceof AnonymousAuthenticationToken);
        return new VerificarAutenticacionRespuesta(autenticado);
    }
}