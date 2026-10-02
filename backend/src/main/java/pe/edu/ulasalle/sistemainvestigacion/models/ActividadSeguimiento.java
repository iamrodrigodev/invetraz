package pe.edu.ulasalle.sistemainvestigacion.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import pe.edu.ulasalle.sistemainvestigacion.core.constants.ValidationConstants;
import pe.edu.ulasalle.sistemainvestigacion.enums.EstadoTarea;

@Entity
@Table(schema = "seguimiento", name = "actividades_seguimiento")
@Getter
@Setter
public class ActividadSeguimiento {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(
            name = "id_tarea_classroom",
            nullable = false,
            unique = true,
            length = ValidationConstants.MAX_CLASSROOM_ID)
    private String idTareaClassroom;

    @Column(
            name = "id_clase_classroom",
            nullable = false,
            length = ValidationConstants.MAX_CLASSROOM_ID)
    private String idClaseClassroom;

    @Column(name = "nombre_clase", length = ValidationConstants.MAX_NOMBRE_RECURSO)
    private String nombreClase;

    @Column(name = "id_tema_classroom", length = ValidationConstants.MAX_CLASSROOM_ID)
    private String idTemaClassroom;

    @Column(name = "nombre_tema", length = ValidationConstants.MAX_NOMBRE_RECURSO)
    private String nombreTema;

    @Column(
            name = "id_plantilla_drive",
            nullable = false,
            length = ValidationConstants.MAX_GOOGLE_DRIVE_FOLDER_ID)
    private String idPlantillaDrive;

    @Column(name = "nombre_plantilla", length = ValidationConstants.MAX_NOMBRE_RECURSO)
    private String nombrePlantilla;

    @Column(name = "enlace_plantilla", length = ValidationConstants.MAX_ENLACE_WEB)
    private String enlacePlantilla;

    @Column(name = "titulo", nullable = false, length = ValidationConstants.MAX_TITULO_TAREA)
    private String titulo;

    @Column(name = "descripcion", length = ValidationConstants.MAX_DESCRIPCION_TAREA)
    private String descripcion;

    @Column(name = "fecha_limite")
    private LocalDateTime fechaLimite;

    @Column(name = "puntaje_maximo")
    private Double puntajeMaximo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = ValidationConstants.MAX_ESTADO_TAREA)
    private EstadoTarea estado;

    @Column(name = "enlace_tarea", length = ValidationConstants.MAX_ENLACE_WEB)
    private String enlaceTarea;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    protected ActividadSeguimiento() {}

    @Builder
    public ActividadSeguimiento(
            UUID id,
            String idTareaClassroom,
            String idClaseClassroom,
            String nombreClase,
            String idTemaClassroom,
            String nombreTema,
            String idPlantillaDrive,
            String nombrePlantilla,
            String enlacePlantilla,
            String titulo,
            String descripcion,
            LocalDateTime fechaLimite,
            Double puntajeMaximo,
            EstadoTarea estado,
            String enlaceTarea,
            LocalDateTime fechaCreacion) {
        this.id = id;
        this.idTareaClassroom = idTareaClassroom;
        this.idClaseClassroom = idClaseClassroom;
        this.nombreClase = nombreClase;
        this.idTemaClassroom = idTemaClassroom;
        this.nombreTema = nombreTema;
        this.idPlantillaDrive = idPlantillaDrive;
        this.nombrePlantilla = nombrePlantilla;
        this.enlacePlantilla = enlacePlantilla;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaLimite = fechaLimite;
        this.puntajeMaximo = puntajeMaximo;
        this.estado = estado != null ? estado : EstadoTarea.PUBLISHED;
        this.enlaceTarea = enlaceTarea;
        this.fechaCreacion = fechaCreacion != null ? fechaCreacion : LocalDateTime.now();
    }
}
