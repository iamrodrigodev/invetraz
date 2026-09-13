package pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso;

import java.util.List;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TareaRespuesta;

public interface CasoUsoListarTareas {
    List<TareaRespuesta> ejecutar(String idClase);
}
