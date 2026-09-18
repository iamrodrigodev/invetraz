package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.VerificarAutenticacionRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoVerificarAutenticacion;

@Service
public class VerificarAutenticacionImpl implements CasoUsoVerificarAutenticacion {

    @Override
    public VerificarAutenticacionRespuesta ejecutar() {
        // Si la peticion llega a este caso de uso, significa que paso el filtro JWT con exito.
        return new VerificarAutenticacionRespuesta(true);
    }
}