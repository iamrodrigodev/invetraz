package pe.edu.ulasalle.sistemainvestigacion.core.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"estado", "mensaje", "idRastreo", "ruta", "fechaHora", "datos", "errores"})
public class ApiRespuesta<T> {

    private int estado;
    private String mensaje;
    private String idRastreo;
    private String ruta;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaHora;

    private T datos;
    private Object errores;

    public ApiRespuesta() {}

    public ApiRespuesta(
            int estado,
            String mensaje,
            String idRastreo,
            String ruta,
            LocalDateTime fechaHora,
            T datos,
            Object errores) {
        this.estado = estado;
        this.mensaje = mensaje;
        this.idRastreo = idRastreo;
        this.ruta = ruta;
        this.fechaHora = fechaHora;
        this.datos = datos;
        this.errores = errores;
    }

    public static <T> ApiRespuesta<T> exito(String mensaje, T datos, int codigo) {
        return ApiRespuesta.<T>builder()
                .estado(codigo)
                .mensaje(mensaje)
                .idRastreo(obtenerTraceIdActual())
                .datos(datos)
                .build();
    }

    public static <T> ResponseEntity<ApiRespuesta<T>> ok(String mensaje, T datos) {
        return ResponseEntity.ok(exito(mensaje, datos, HttpStatus.OK.value()));
    }

    public static <T> ResponseEntity<ApiRespuesta<T>> ok(String mensaje) {
        return ResponseEntity.ok(exito(mensaje, null, HttpStatus.OK.value()));
    }

    public static <T> ResponseEntity<ApiRespuesta<T>> creado(String mensaje, T datos) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(exito(mensaje, datos, HttpStatus.CREATED.value()));
    }

    public static <T> ApiRespuesta<T> error(
            int codigo, String mensaje, String ruta, Object errores) {
        return ApiRespuesta.<T>builder()
                .estado(codigo)
                .mensaje(mensaje)
                .idRastreo(obtenerTraceIdActual())
                .ruta(ruta)
                .fechaHora(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .errores(errores)
                .build();
    }

    private static String obtenerTraceIdActual() {
        return MDC.get("traceId");
    }
}
