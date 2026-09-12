package pe.edu.ulasalle.sistemainvestigacion.core.security;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public final class EntradaSegura {

    private EntradaSegura() {}

    public static String limpiar(String texto) {
        if (texto == null) {
            return null;
        }
        return Jsoup.clean(texto, Safelist.none()).trim();
    }
}
