package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.TemaRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.models.TemaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TemaRepository;
import pe.edu.ulasalle.sistemainvestigacion.services.casosdeuso.CasoUsoListarTemas;

@Slf4j
@Service
public class ListarTemasImpl implements CasoUsoListarTemas {

    private final TemaRepository temaRepository;

    public ListarTemasImpl(TemaRepository temaRepository) {
        this.temaRepository = temaRepository;
    }

    @Override
    public List<TemaRespuesta> ejecutar(String idClase) {
        log.info("Consultando temas de la clase '{}' en Google Classroom", idClase);
        List<TemaClassroom> temas = temaRepository.listarPorClase(idClase);
        log.info("Temas obtenidos para la clase '{}': {}", idClase, temas.size());

        if (temas.isEmpty()) {
            return Collections.emptyList();
        }

        List<TemaRespuesta> resultado = new ArrayList<>(temas.size());
        for (TemaClassroom tema : temas) {
            resultado.add(
                    TemaRespuesta.builder()
                            .idTema(tema.getIdTema())
                            .idClase(tema.getIdClase())
                            .nombre(tema.getNombre())
                            .build());
        }
        return resultado;
    }
}
