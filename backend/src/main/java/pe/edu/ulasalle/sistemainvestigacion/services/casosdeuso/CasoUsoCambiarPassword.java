package pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso;

import pe.edu.ulasalle.sistemainvestigacion.dto.peticion.CambiarPasswordPeticion;

public interface CasoUsoCambiarPassword {
    void ejecutar(CambiarPasswordPeticion peticion);
}
