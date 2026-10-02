package pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso;

import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearTareaPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;

public interface CasoUsoCrearTarea {
    TareaRespuesta ejecutar(String idClase, CrearTareaPeticion peticion);
}
