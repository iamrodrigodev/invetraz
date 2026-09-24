package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import com.google.api.services.classroom.model.CourseWork;
import com.google.api.services.classroom.model.Date;
import com.google.api.services.classroom.model.DriveFile;
import com.google.api.services.classroom.model.ListCourseWorkResponse;
import com.google.api.services.classroom.model.Material;
import com.google.api.services.classroom.model.SharedDriveFile;
import com.google.api.services.classroom.model.TimeOfDay;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.CacheClassroom;
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
    private static final String CAMPOS_CREACION_TAREA = "id,alternateLink";
    private static final String CAMPOS_TAREA =
            "id,courseId,title,description,state,alternateLink,dueDate,dueTime,maxPoints,topicId,materials";
    private static final String CAMPOS_LISTA_TAREAS = "courseWork(" + CAMPOS_TAREA + ")";

    private final ProveedorClassroom proveedorClassroom;
    private final ManejadorErroresGoogle manejadorErroresGoogle;
    private final CacheClassroom cacheClassroom;

    public TareaClassroomRepositoryImpl(
            ProveedorClassroom proveedorClassroom,
            ManejadorErroresGoogle manejadorErroresGoogle,
            CacheClassroom cacheClassroom) {
        this.proveedorClassroom = proveedorClassroom;
        this.manejadorErroresGoogle = manejadorErroresGoogle;
        this.cacheClassroom = cacheClassroom;
    }

    @Override
    public List<TareaClassroom> listarPorClase(String idClase) {
        return cacheClassroom.obtenerTareas(idClase, () -> consultarTareasClaseDirecto(idClase));
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

            if (tarea.getIdTema() != null
                    && !tarea.getIdTema().isBlank()
                    && !tarea.getIdTema().startsWith("mock")) {
                coursework.setTopicId(tarea.getIdTema());
            }

            if (tarea.getIdPlantilla() != null
                    && !tarea.getIdPlantilla().isBlank()
                    && !tarea.getIdPlantilla().startsWith("mock")) {
                DriveFile driveFile = new DriveFile().setId(tarea.getIdPlantilla());
                SharedDriveFile sharedDriveFile =
                        new SharedDriveFile().setDriveFile(driveFile).setShareMode("STUDENT_COPY");
                Material material = new Material().setDriveFile(sharedDriveFile);
                coursework.setMaterials(Collections.singletonList(material));
            }

            CourseWork tareaCreada =
                    proveedorClassroom
                            .obtenerCliente()
                            .courses()
                            .courseWork()
                            .create(idClase, coursework)
                            .setFields(CAMPOS_CREACION_TAREA)
                            .execute();

            cacheClassroom.invalidarTareas(idClase);

            return TareaClassroom.builder()
                    .idTarea(tareaCreada.getId())
                    .idClase(idClase)
                    .titulo(tarea.getTitulo())
                    .descripcion(tarea.getDescripcion())
                    .estado(tarea.getEstado() != null ? tarea.getEstado() : EstadoTarea.PUBLISHED)
                    .enlaceTarea(tareaCreada.getAlternateLink())
                    .fechaLimite(tarea.getFechaLimite())
                    .puntajeMaximo(tarea.getPuntajeMaximo())
                    .idTema(tarea.getIdTema())
                    .idPlantilla(tarea.getIdPlantilla())
                    .build();
        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar(
                    "TareaClassroomRepository.guardar (" + idClase + ")", e);
        }
    }

    private List<TareaClassroom> consultarTareasClaseDirecto(String idClase) {
        try {
            ListCourseWorkResponse response =
                    proveedorClassroom
                            .obtenerCliente()
                            .courses()
                            .courseWork()
                            .list(idClase)
                            .setFields(CAMPOS_LISTA_TAREAS)
                            .execute();

            List<CourseWork> tareas = response.getCourseWork();
            if (tareas == null || tareas.isEmpty()) {
                return Collections.emptyList();
            }

            List<TareaClassroom> resultado = new ArrayList<>(tareas.size());
            for (CourseWork cw : tareas) {
                resultado.add(mapearTarea(cw));
            }
            return resultado;
        } catch (Exception e) {
            throw manejadorErroresGoogle.manejar(
                    "TareaClassroomRepository.listarPorClase (" + idClase + ")", e);
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
                .idTema(coursework.getTopicId())
                .idPlantilla(extraerIdPlantilla(coursework.getMaterials()))
                .build();
    }

    private String extraerIdPlantilla(List<Material> materiales) {
        if (materiales == null || materiales.isEmpty()) {
            return null;
        }
        for (Material material : materiales) {
            if (material != null
                    && material.getDriveFile() != null
                    && material.getDriveFile().getDriveFile() != null
                    && material.getDriveFile().getDriveFile().getId() != null) {
                return material.getDriveFile().getDriveFile().getId();
            }
        }
        return null;
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
