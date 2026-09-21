package pe.edu.ulasalle.sistemainvestigacion.core.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import pe.edu.ulasalle.sistemainvestigacion.core.response.ApiRespuesta;

@Slf4j
@RestControllerAdvice
public class ManejadorExcepcionesGlobal {

    @ExceptionHandler(ExcepcionDeNegocio.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarErrorDeNegocio(
            ExcepcionDeNegocio excepcion, HttpServletRequest solicitud) {
        log.warn(
                "Excepcion de negocio en {}: {}",
                solicitud.getRequestURI(),
                excepcion.getMessage());
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(400, excepcion.getMessage(), solicitud.getRequestURI(), null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    @ExceptionHandler(ExcepcionDeRecursoNoEncontrado.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarRecursoNoEncontradoDeNegocio(
            ExcepcionDeRecursoNoEncontrado excepcion, HttpServletRequest solicitud) {
        log.warn(
                "Recurso no encontrado en {}: {}",
                solicitud.getRequestURI(),
                excepcion.getMessage());
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(404, excepcion.getMessage(), solicitud.getRequestURI(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    @ExceptionHandler(ExcepcionPersonalizada.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarErrorPersonalizado(
            ExcepcionPersonalizada excepcion, HttpServletRequest solicitud) {
        log.warn(
                "Error personalizado en {}: {}", solicitud.getRequestURI(), excepcion.getMessage());
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(
                        excepcion.getCodigo(),
                        excepcion.getMessage(),
                        solicitud.getRequestURI(),
                        null);
        return ResponseEntity.status(excepcion.getCodigo()).body(respuesta);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarErrorDeValidacion(
            MethodArgumentNotValidException excepcion, HttpServletRequest solicitud) {
        Map<String, String> erroresValidacion = extraerErroresValidacion(excepcion);
        log.warn("Error de validacion en {}: {}", solicitud.getRequestURI(), erroresValidacion);
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(
                        MensajesDeError.DATOS_INVALIDOS.getCodigo(),
                        MensajesDeError.DATOS_INVALIDOS.getMensaje(),
                        solicitud.getRequestURI(),
                        erroresValidacion);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    private Map<String, String> extraerErroresValidacion(
            MethodArgumentNotValidException excepcion) {
        Map<String, String> errores = new HashMap<>();
        for (FieldError errorCampo : excepcion.getBindingResult().getFieldErrors()) {
            String mensajeError = errorCampo.getDefaultMessage();
            if (mensajeError != null
                    && mensajeError.toLowerCase(Locale.ROOT).contains("required")) {
                mensajeError = "Este campo es obligatorio";
            }
            errores.put(
                    errorCampo.getField(), mensajeError != null ? mensajeError : "Dato invalido");
        }
        return errores;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarJsonMalformado(
            HttpMessageNotReadableException excepcion, HttpServletRequest solicitud) {
        log.warn("JSON malformado en {}", solicitud.getRequestURI());
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(
                        HttpStatus.BAD_REQUEST.value(),
                        "El cuerpo de la peticion contiene un formato JSON invalido",
                        solicitud.getRequestURI(),
                        null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarRecursoNoEncontrado(
            NoResourceFoundException excepcion, HttpServletRequest solicitud) {
        log.info("Ruta no encontrada: {}", solicitud.getRequestURI());
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(
                        MensajesDeError.RECURSO_NO_ENCONTRADO.getCodigo(),
                        MensajesDeError.RECURSO_NO_ENCONTRADO.getMensaje(),
                        solicitud.getRequestURI(),
                        null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarMetodoNoPermitido(
            HttpRequestMethodNotSupportedException excepcion, HttpServletRequest solicitud) {
        log.info("Metodo no permitido en {}", solicitud.getRequestURI());
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(
                        HttpStatus.METHOD_NOT_ALLOWED.value(),
                        MensajesDeError.METODO_NO_PERMITIDO.getMensaje(),
                        solicitud.getRequestURI(),
                        null);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .headers(excepcion.getHeaders())
                .body(respuesta);
    }

    @ExceptionHandler(org.springframework.web.HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarTipoMedioNoSoportado(
            org.springframework.web.HttpMediaTypeNotSupportedException excepcion,
            HttpServletRequest solicitud) {
        log.warn(
                "Tipo de medio no soportado en {}: {}",
                solicitud.getRequestURI(),
                excepcion.getMessage());
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(
                        HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(),
                        "Tipo de contenido no soportado. Se requiere application/json.",
                        solicitud.getRequestURI(),
                        null);
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(respuesta);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiRespuesta<Void>> manejarErrorInterno(
            Exception excepcion, HttpServletRequest solicitud) {
        log.error("Error interno del servidor en " + solicitud.getRequestURI(), excepcion);
        ApiRespuesta<Void> respuesta =
                ApiRespuesta.error(
                        MensajesDeError.ERROR_INTERNO.getCodigo(),
                        MensajesDeError.ERROR_INTERNO.getMensaje(),
                        solicitud.getRequestURI(),
                        null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }
}
