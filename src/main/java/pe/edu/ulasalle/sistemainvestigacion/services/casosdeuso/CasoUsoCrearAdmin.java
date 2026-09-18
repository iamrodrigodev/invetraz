package pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso;

import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CrearAdminPeticion;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.UsuarioDTO;

public interface CasoUsoCrearAdmin {
    UsuarioDTO ejecutar(CrearAdminPeticion peticion);
}
