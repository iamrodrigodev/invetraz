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
            int codigo = gjre.getStatusCode();
            log.warn(
                    "Error de Google Classroom en {}: status={}, error={}",
                    contexto,
                    codigo,
                    gjre.getDetails() != null ? gjre.getDetails().getMessage() : gjre.getMessage());

            if (codigo == 400) {
                return new ExcepcionPersonalizada(MensajesDeError.DATOS_INVALIDOS);
            }
            if (codigo == 401) {
                return new ExcepcionPersonalizada(MensajesDeError.ERROR_CONFIGURACION_GOOGLE);
            }
            if (codigo == 403) {
                return new ExcepcionPersonalizada(MensajesDeError.SIN_PERMISOS_DOCENTE);
            }
            if (codigo == 404) {
                return new ExcepcionPersonalizada(MensajesDeError.RECURSO_NO_ENCONTRADO);
            }
            if (codigo == 429) {
                return new ExcepcionPersonalizada(MensajesDeError.LIMITE_PETICIONES_EXCEDIDO);
            }
            if (codigo >= 500) {
                return new ExcepcionPersonalizada(MensajesDeError.ERROR_COMUNICACION_GOOGLE);
            }
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
}
