package pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso;

import java.util.List;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TemaRespuesta;

public interface CasoUsoListarTemas {
    List<TemaRespuesta> ejecutar(String idClase);
}
