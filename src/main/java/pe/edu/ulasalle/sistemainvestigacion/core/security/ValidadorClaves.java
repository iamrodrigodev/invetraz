package pe.edu.ulasalle.sistemainvestigacion.core.security;

import pe.edu.ulasalle.sistemainvestigacion.core.exceptions.ExcepcionPersonalizada;
import java.util.regex.Pattern;

public final class ValidadorClaves {

    private static final Pattern TIENE_MAYUSCULA = Pattern.compile("[A-Z]");
    private static final Pattern TIENE_MINUSCULA = Pattern.compile("[a-z]");
    private static final Pattern TIENE_DIGITO = Pattern.compile("\\d");
    private static final Pattern TIENE_ESPECIAL = Pattern.compile("[\\W_]");

    private ValidadorClaves() {}

    public static void validar(String clave) {
        validarFortaleza(clave);
    }

    public static void validarFortaleza(String clave) {
        if (clave == null || clave.isBlank()) {
            throw new ExcepcionPersonalizada("La clave no puede estar vacía", 400);
        }
        if (clave.length() < 8) {
            throw new ExcepcionPersonalizada("La clave debe tener al menos 8 caracteres", 400);
        }
        if (!TIENE_MAYUSCULA.matcher(clave).find()) {
            throw new ExcepcionPersonalizada(
                    "La clave debe contener al menos una letra mayúscula", 400);
        }
        if (!TIENE_MINUSCULA.matcher(clave).find()) {
            throw new ExcepcionPersonalizada(
                    "La clave debe contener al menos una letra minúscula", 400);
        }
        if (!TIENE_DIGITO.matcher(clave).find()) {
            throw new ExcepcionPersonalizada("La clave debe contener al menos un número", 400);
        }
        if (!TIENE_ESPECIAL.matcher(clave).find()) {
            throw new ExcepcionPersonalizada(
                    "La clave debe contener al menos un carácter especial (ej. @, #, $, %, etc.)",
                    400);
        }
    }
}


