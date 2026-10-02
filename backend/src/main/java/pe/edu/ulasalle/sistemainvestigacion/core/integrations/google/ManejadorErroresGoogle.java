package pe.edu.ulasalle.sistemainvestigacion.core.integrations.google;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import java.net.SocketTimeoutException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Slf4j
@Component
public class ManejadorErroresGoogle {

    public ExcepcionPersonalizada manejar(String contexto, Exception excepcion) {
        if (excepcion instanceof GoogleJsonResponseException gjre) {
            log.warn(
                    "Error de Google Classroom en {}: status={}, error={}",
                    contexto,
                    gjre.getStatusCode(),
                    gjre.getDetails() != null ? gjre.getDetails().getMessage() : gjre.getMessage());
            return new ExcepcionPersonalizada(mapearCodigoEstadoGoogle(gjre.getStatusCode()));
        }

        if (excepcion.getCause() instanceof SocketTimeoutException
                || excepcion instanceof SocketTimeoutException) {
            log.warn("Tiempo de espera agotado al comunicar con Google Classroom en {}", contexto);
            return new ExcepcionPersonalizada(MensajesDeError.TIEMPO_ESPERA_AGOTADO);
        }

        if (excepcion instanceof ExcepcionPersonalizada personalizada) {
            return personalizada;
        }

        log.error("Error no controlado en Google Classroom ({})", contexto, excepcion);
        return new ExcepcionPersonalizada(MensajesDeError.ERROR_INTERNO);
    }

    private MensajesDeError mapearCodigoEstadoGoogle(int codigo) {
        if (codigo >= 500) {
            return MensajesDeError.ERROR_COMUNICACION_GOOGLE;
        }
        return switch (codigo) {
            case 400 -> MensajesDeError.DATOS_INVALIDOS;
            case 401 -> MensajesDeError.ERROR_CONFIGURACION_GOOGLE;
            case 403 -> MensajesDeError.SIN_PERMISOS_DOCENTE;
            case 404 -> MensajesDeError.RECURSO_NO_ENCONTRADO;
            case 429 -> MensajesDeError.LIMITE_PETICIONES_EXCEDIDO;
            default -> MensajesDeError.ERROR_INTERNO;
        };
    }
}
