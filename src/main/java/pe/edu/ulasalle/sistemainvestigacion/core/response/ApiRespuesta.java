package pe.edu.ulasalle.sistemainvestigacion.core.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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
@JsonPropertyOrder({
    "estado",
    "mensaje",
    "datos",
    "detalles",
    "ruta",
    "idRastreo",
    "fecha",
    "hora",
    "errores"
})
public class ApiRespuesta<T> {

    private int estado;
    private String mensaje;
    private T datos;
    private String ruta;
    private String idRastreo;
    private String fecha;
    private String hora;
    private Object errores;

    private static final DateTimeFormatter FORMATO_HORA = DateTimeFormatter.ofPattern("HH:mm:ss");

    public ApiRespuesta() {}

    public ApiRespuesta(
            int estado,
            String mensaje,
            T datos,
            String ruta,
            String idRastreo,
            String fecha,
            String hora,
            Object errores) {
        this.estado = estado;
        this.mensaje = mensaje;
        this.datos = datos;
        this.ruta = ruta;
        this.idRastreo = idRastreo;
        this.fecha = fecha;
        this.hora = hora;
        this.errores = errores;
    }

    public ApiRespuesta(
            int estado,
            String mensaje,
            T datos,
            String ruta,
            String fecha,
            String hora,
            Object errores) {
        this(estado, mensaje, datos, ruta, obtenerTraceIdActual(), fecha, hora, errores);
    }

    public static <T> ApiRespuesta<T> exito(String mensaje, T datos, int codigo) {
        return ApiRespuesta.<T>builder()
                .estado(codigo)
                .mensaje(mensaje)
                .datos(datos)
                .idRastreo(obtenerTraceIdActual())
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
                .ruta(ruta)
                .idRastreo(obtenerTraceIdActual())
                .fecha(LocalDate.now().toString())
                .hora(LocalTime.now().format(FORMATO_HORA))
                .errores(errores)
                .build();
    }

    private static String obtenerTraceIdActual() {
        return MDC.get("traceId");
    }
}
