package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.model.CourseWork;
import com.google.api.services.classroom.model.Date;
import com.google.api.services.classroom.model.ListCourseWorkResponse;
import com.google.api.services.classroom.model.TimeOfDay;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;

@Slf4j
@Repository
public class TareaClassroomRepositoryImpl implements TareaRepository {

    private final Classroom clienteGoogle;

    public TareaClassroomRepositoryImpl(Classroom clienteGoogle) {
        this.clienteGoogle = clienteGoogle;
    }

    @Override
    public List<TareaClassroom> listarPorClase(String idClase) {
        try {
            ListCourseWorkResponse response =
                    clienteGoogle
                            .courses()
                            .courseWork()
                            .list(idClase)
                            .setFields(
                                    "courseWork(id,courseId,title,description,state,alternateLink,dueDate,dueTime,maxPoints)")
                            .execute();

            List<CourseWork> tareas = response.getCourseWork();
            if (tareas == null || tareas.isEmpty()) {
                return Collections.emptyList();
            }

            return tareas.stream().map(this::mapearTarea).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error al listar las tareas de la clase {} en Google Classroom", idClase, e);
            throw new ExcepcionPersonalizada(MensajesDeError.ERROR_INTERNO);
        }
    }

    private TareaClassroom mapearTarea(CourseWork coursework) {
        return TareaClassroom.builder()
                .idTarea(coursework.getId())
                .idClase(coursework.getCourseId())
                .titulo(coursework.getTitle())
                .descripcion(coursework.getDescription())
                .estado(mapearEstado(coursework.getState()))
                .enlaceTarea(coursework.getAlternateLink())
                .fechaLimite(mapearFechaLimite(coursework.getDueDate(), coursework.getDueTime()))
                .puntajeMaximo(coursework.getMaxPoints())
                .build();
    }

    private EstadoTarea mapearEstado(String estado) {
        if (estado == null) {
            return EstadoTarea.PUBLISHED;
        }
        try {
            return EstadoTarea.valueOf(estado);
        } catch (IllegalArgumentException e) {
            return EstadoTarea.PUBLISHED;
        }
    }

    private LocalDateTime mapearFechaLimite(Date fecha, TimeOfDay hora) {
        if (fecha == null
                || fecha.getYear() == null
                || fecha.getMonth() == null
                || fecha.getDay() == null) {
            return null;
        }
        int anio = fecha.getYear();
        int mes = fecha.getMonth();
        int dia = fecha.getDay();
        int horas = (hora != null && hora.getHours() != null) ? hora.getHours() : 23;
        int minutos = (hora != null && hora.getMinutes() != null) ? hora.getMinutes() : 59;
        int segundos = (hora != null && hora.getSeconds() != null) ? hora.getSeconds() : 59;
        return LocalDateTime.of(anio, mes, dia, horas, minutos, segundos);
    }
}
