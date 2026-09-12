package pe.edu.ulasalle.sistemainvestigacion.core.security;

public interface IServicioHash {

    String hashear(String clave);

    boolean verificar(String clavePlana, String hashAlmacenado);
}
