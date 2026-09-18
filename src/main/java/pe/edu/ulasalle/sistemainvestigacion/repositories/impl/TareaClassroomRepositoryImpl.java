package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import com.google.api.services.classroom.model.CourseWork;
import com.google.api.services.classroom.model.Date;
import com.google.api.services.classroom.model.ListCourseWorkResponse;
import com.google.api.services.classroom.model.TimeOfDay;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ManejadorErroresGoogle;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;
import pe.edu.ulasalle.sistemainvestigacion.models.TareaClassroom;
import pe.edu.ulasalle.sistemainvestigacion.repositories.TareaRepository;

@Slf4j
@Repository
public class TareaClassroomRepositoryImpl implements TareaRepository {

    private static final ZoneId ZONA_LIMA = ZoneId.of("America/Lima");
    private static final ZoneId ZONA_UTC = ZoneId.of("UTC");

    private final ProveedorClassroom proveedorClassroom;
    private final ManejadorErroresGoogle manejadorErroresGoogle;

    public TareaClassroomRepositoryImpl(
            ProveedorClassroom proveedorClassroom, ManejadorErroresGoogle manejadorErroresGoogle) {
        this.proveedorClassroom = proveedorClassroom;
        this.manejadorErroresGoogle = manejadorErroresGoogle;
    }

    @Override
    public List<TareaClassroom> listarPorClase(String idClase) {
        try {
            ListCourseWorkResponse response =
                    proveedorClassroom
                            .obtenerCliente()
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
            throw manejadorErroresGoogle.manejar(
                    "TareaClassroomRepository.listarPorClase (" + idClase + ")", e);
        }
    }

    @Override
    public TareaClassroom guardar(String idClase, TareaClassroom tarea) {
        try {
            CourseWork coursework =
                    new CourseWork()
                            .setTitle(tarea.getTitulo())
                            .setDescription(tarea.getDescripcion())
                            .setMaxPoints(tarea.getPuntajeMaximo())
                            .setWorkType("ASSIGNMENT")
                            .setState(
                                    tarea.getEstado() != null
                                            ? tarea.getEstado().name()
                                            : EstadoTarea.PUBLISHED.name());

            if (tarea.getFechaLimite() != null) {
                ZonedDateTime fechaLima = tarea.getFechaLimite().atZone(ZONA_LIMA);
                ZonedDateTime fechaUtc = fechaLima.withZoneSameInstant(ZONA_UTC);
                Date dueDate =
                        new Date()
                                .setYear(fechaUtc.getYear())
                                .setMonth(fechaUtc.getMonthValue())
                                .setDay(fechaUtc.getDayOfMonth());
                TimeOfDay dueTime =
                        new TimeOfDay()
                                .setHours(fechaUtc.getHour())
                                .setMinutes(fechaUtc.getMinute())
                                .setSeconds(fechaUtc.getSecond());
                coursework.setDueDate(dueDate);
                coursework.setDueTime(dueTime);
            }

            CourseWork tareaCreada =
                    proveedorClassroom
                            .obtenerCliente()
                            .courses()
                            .courseWork()
                            .create(idClase, coursework)
                            .execute();

            return mapearTarea(tareaCreada);
        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar(
                    "TareaClassroomRepository.guardar (" + idClase + ")", e);
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

        LocalDateTime fechaUtc = LocalDateTime.of(anio, mes, dia, horas, minutos, segundos);
        ZonedDateTime utcZoned = fechaUtc.atZone(ZONA_UTC);
        ZonedDateTime limaZoned = utcZoned.withZoneSameInstant(ZONA_LIMA);
        return limaZoned.toLocalDateTime();
    }
}
