package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import com.google.api.services.classroom.model.ListTopicResponse;
import com.google.api.services.classroom.model.Topic;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.CacheClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ManejadorErroresGoogle;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.models.TemaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TemaRepository;

@Slf4j
@Repository
public class TemaClassroomRepositoryImpl implements TemaRepository {

    private static final String CAMPOS_LISTA_TEMAS = "topic(topicId,courseId,name)";

    private final ProveedorClassroom proveedorClassroom;
    private final ManejadorErroresGoogle manejadorErroresGoogle;
    private final CacheClassroom cacheClassroom;

    public TemaClassroomRepositoryImpl(
            ProveedorClassroom proveedorClassroom,
            ManejadorErroresGoogle manejadorErroresGoogle,
            CacheClassroom cacheClassroom) {
        this.proveedorClassroom = proveedorClassroom;
        this.manejadorErroresGoogle = manejadorErroresGoogle;
        this.cacheClassroom = cacheClassroom;
    }

    @Override
    public List<TemaClassroom> listarPorClase(String idClase) {
        return cacheClassroom.obtenerTemas(idClase, () -> consultarTemasClaseDirecto(idClase));
    }

    private List<TemaClassroom> consultarTemasClaseDirecto(String idClase) {
        try {
            ListTopicResponse response =
                    proveedorClassroom
                            .obtenerCliente()
                            .courses()
                            .topics()
                            .list(idClase)
                            .setPageSize(50)
                            .setFields(CAMPOS_LISTA_TEMAS)
                            .execute();

            List<Topic> topics = response.getTopic();
            if (topics == null || topics.isEmpty()) {
                return Collections.emptyList();
            }

            List<TemaClassroom> resultado = new ArrayList<>(topics.size());
            for (Topic t : topics) {
                resultado.add(
                        TemaClassroom.builder()
                                .idTema(t.getTopicId())
                                .idClase(t.getCourseId())
                                .nombre(t.getName())
                                .build());
            }
            return resultado;
        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar(
                    "TemaClassroomRepository.listarPorClase (" + idClase + ")", e);
        }
    }
}
