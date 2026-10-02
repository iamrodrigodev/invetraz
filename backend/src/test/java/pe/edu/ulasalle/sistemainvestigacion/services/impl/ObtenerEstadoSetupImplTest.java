package pe.edu.ulasalle.sistemainvestigacion.services.impl;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.dto.respuesta.EstadoSetupRespuesta;
import pe.edu.ulasalle.sistemainvestigacion.repositories.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class ObtenerEstadoSetupImplTest {

    @Mock private UsuarioRepository usuarioRepository;

    @InjectMocks private ObtenerEstadoSetupImpl obtenerEstadoSetup;

    @Test
    void cuandoNoHayUsuarios_devuelveNoConfigurado() {
        when(usuarioRepository.count()).thenReturn(0L);

        EstadoSetupRespuesta respuesta = obtenerEstadoSetup.ejecutar();

        assertFalse(respuesta.configurado());
    }

    @Test
    void cuandoExisteAlMenosUnUsuario_devuelveConfigurado() {
        when(usuarioRepository.count()).thenReturn(1L);

        EstadoSetupRespuesta respuesta = obtenerEstadoSetup.ejecutar();

        assertTrue(respuesta.configurado());
    }

    @Test
    void cuandoYaEstaMarcadoComoConfigurado_noConsultaRepositorio() {
        when(usuarioRepository.count()).thenReturn(1L);

        EstadoSetupRespuesta respuesta1 = obtenerEstadoSetup.ejecutar();
        assertTrue(respuesta1.configurado());

        // Segunda llamada debe usar cache sin volver a consultar el repositorio
        EstadoSetupRespuesta respuesta2 = obtenerEstadoSetup.ejecutar();
        assertTrue(respuesta2.configurado());
        org.mockito.Mockito.verify(usuarioRepository, org.mockito.Mockito.times(1)).count();
    }
}
