package pe.edu.ulasalle.sistemainvestigacion.core.security;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.MensajesDeError;

@Service
public class ServicioLimitadorIntentos {

    private static final int UMBRAL_LIMPIEZA = 500;
    private static final long TIEMPO_EXPIRACION_MS = 300_000L; // 5 minutos

    private static final class Registro {
        private int intentos;
        private long inicioVentana;
        private long bloqueadoHasta;

        Registro(long ahora) {
            this.intentos = 0;
            this.inicioVentana = ahora;
            this.bloqueadoHasta = 0;
        }
    }

    private final ConcurrentHashMap<String, Registro> intentosPorClave = new ConcurrentHashMap<>();

    public void comprobarBloqueo(String clave, MensajesDeError errorBloqueo) {
        Registro registro = intentosPorClave.get(clave);
        if (registro == null) {
            return;
        }

        long ahora = System.currentTimeMillis();
        synchronized (registro) {
            if (ahora < registro.bloqueadoHasta) {
                throw new ExcepcionPersonalizada(errorBloqueo);
            }
        }
    }

    public void registrarFallo(
            String clave, int maxIntentos, long ventanaMs, MensajesDeError errorBloqueo) {
        long ahora = System.currentTimeMillis();
        Registro registro = intentosPorClave.computeIfAbsent(clave, k -> new Registro(ahora));

        synchronized (registro) {
            if (ahora < registro.bloqueadoHasta) {
                throw new ExcepcionPersonalizada(errorBloqueo);
            }

            if (ahora - registro.inicioVentana > ventanaMs) {
                registro.intentos = 1;
                registro.inicioVentana = ahora;
            } else {
                registro.intentos++;
            }

            if (registro.intentos >= maxIntentos) {
                registro.bloqueadoHasta = ahora + ventanaMs;
                throw new ExcepcionPersonalizada(errorBloqueo);
            }
        }

        limpiarExpiradosSiEsNecesario(ahora);
    }

    public void limpiarIntentos(String clave) {
        intentosPorClave.remove(clave);
    }

    private void limpiarExpiradosSiEsNecesario(long ahora) {
        if (intentosPorClave.size() > UMBRAL_LIMPIEZA) {
            intentosPorClave
                    .entrySet()
                    .removeIf(
                            entry -> {
                                Registro r = entry.getValue();
                                synchronized (r) {
                                    return ahora > r.bloqueadoHasta
                                            && (ahora - r.inicioVentana) > TIEMPO_EXPIRACION_MS;
                                }
                            });
        }
    }
}
