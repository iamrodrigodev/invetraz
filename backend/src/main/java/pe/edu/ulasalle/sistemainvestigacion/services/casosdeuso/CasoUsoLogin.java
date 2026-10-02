package pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso;

import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.LoginPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.LoginRespuesta;

public interface CasoUsoLogin {
    LoginRespuesta ejecutar(LoginPeticion peticion);
}
