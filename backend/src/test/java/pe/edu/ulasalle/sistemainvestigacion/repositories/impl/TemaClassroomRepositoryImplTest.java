package pe.edu.ulasalle.sistemainvestigacion.repositories.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.CacheClassroom;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ManejadorErroresGoogle;
import pe.edu.ulasalle.sistemainvestigacion.core.integrations.google.ProveedorClassroom;
import pe.edu.ulasalle.sistemainvestigacion.models.TemaClassroom;

@ExtendWith(MockitoExtension.class)
class TemaClassroomRepositoryImplTest {

    @Mock private ProveedorClassroom proveedorClassroom;

    @Mock private ManejadorErroresGoogle manejadorErroresGoogle;

    @Mock private CacheClassroom cacheClassroom;

    private TemaClassroomRepositoryImpl repository;

    @BeforeEach
    void setUp() {
        repository =
                new TemaClassroomRepositoryImpl(
                        proveedorClassroom, manejadorErroresGoogle, cacheClassroom);
    }

    @Test
    void deberiaDelegarListarPorClaseACacheClassroom() {
        List<TemaClassroom> esperado =
                List.of(
                        TemaClassroom.builder()
                                .idTema("tema-1")
                                .idClase("clase-1")
                                .nombre("Unidad 1")
                                .build());

        when(cacheClassroom.obtenerTemas(eq("clase-1"), any())).thenReturn(esperado);

        List<TemaClassroom> resultado = repository.listarPorClase("clase-1");

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Unidad 1", resultado.get(0).getNombre());
        verify(cacheClassroom).obtenerTemas(eq("clase-1"), any());
    }
}
