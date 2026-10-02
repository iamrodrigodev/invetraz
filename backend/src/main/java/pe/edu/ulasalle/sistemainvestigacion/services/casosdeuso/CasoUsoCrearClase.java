package pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso;

import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearClasePeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.ClaseRespuesta;

public interface CasoUsoCrearClase {
    ClaseRespuesta ejecutar(CrearClasePeticion peticion);
}
