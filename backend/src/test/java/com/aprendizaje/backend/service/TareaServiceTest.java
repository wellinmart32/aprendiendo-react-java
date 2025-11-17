package com.aprendizaje.backend.service;

import com.aprendizaje.backend.model.Tarea;
import com.aprendizaje.backend.repository.TareaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para TareaService
 * Usa Mockito para simular el repositorio
 */
@ExtendWith(MockitoExtension.class)
class TareaServiceTest {

    @Mock
    private TareaRepository tareaRepository;

    @InjectMocks
    private TareaService tareaService;

    private Tarea tarea1;
    private Tarea tarea2;

    /**
     * Se ejecuta antes de cada test
     * Prepara los datos de prueba
     */
    @BeforeEach
    void setUp() {
        tarea1 = new Tarea();
        tarea1.setId(1L);
        tarea1.setTitulo("Tarea de prueba 1");
        tarea1.setDescripcion("Descripción 1");
        tarea1.setCompletada(false);
        tarea1.setFechaCreacion(LocalDateTime.now());

        tarea2 = new Tarea();
        tarea2.setId(2L);
        tarea2.setTitulo("Tarea de prueba 2");
        tarea2.setDescripcion("Descripción 2");
        tarea2.setCompletada(true);
        tarea2.setFechaCreacion(LocalDateTime.now());
    }

    /**
     * Test: Obtener todas las tareas
     */
    @Test
    void testObtenerTodasLasTareas() {
        // Arrange (Preparar)
        List<Tarea> tareas = Arrays.asList(tarea1, tarea2);
        when(tareaRepository.findAll()).thenReturn(tareas);

        // Act (Actuar)
        List<Tarea> resultado = tareaService.obtenerTodasLasTareas();

        // Assert (Verificar)
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(tareaRepository, times(1)).findAll();
    }

    /**
     * Test: Obtener tarea por ID - Tarea existe
     */
    @Test
    void testObtenerTareaPorId_TareaExiste() {
        // Arrange
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea1));

        // Act
        Optional<Tarea> resultado = tareaService.obtenerTareaPorId(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("Tarea de prueba 1", resultado.get().getTitulo());
        verify(tareaRepository, times(1)).findById(1L);
    }

    /**
     * Test: Obtener tarea por ID - Tarea no existe
     */
    @Test
    void testObtenerTareaPorId_TareaNoExiste() {
        // Arrange
        when(tareaRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Tarea> resultado = tareaService.obtenerTareaPorId(999L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(tareaRepository, times(1)).findById(999L);
    }

    /**
     * Test: Crear una nueva tarea
     */
    @Test
    void testCrearTarea() {
        // Arrange
        Tarea nuevaTarea = new Tarea("Nueva tarea", "Descripción nueva", false);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(nuevaTarea);

        // Act
        Tarea resultado = tareaService.crearTarea(nuevaTarea);

        // Assert
        assertNotNull(resultado);
        assertEquals("Nueva tarea", resultado.getTitulo());
        verify(tareaRepository, times(1)).save(any(Tarea.class));
    }

    /**
     * Test: Actualizar tarea existente
     */
    @Test
    void testActualizarTarea_TareaExiste() {
        // Arrange
        Tarea tareaActualizada = new Tarea("Título actualizado", "Descripción actualizada", true);
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea1));
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaActualizada);

        // Act
        Tarea resultado = tareaService.actualizarTarea(1L, tareaActualizada);

        // Assert
        assertNotNull(resultado);
        assertEquals("Título actualizado", resultado.getTitulo());
        verify(tareaRepository, times(1)).findById(1L);
        verify(tareaRepository, times(1)).save(any(Tarea.class));
    }

    /**
     * Test: Actualizar tarea - Tarea no existe
     */
    @Test
    void testActualizarTarea_TareaNoExiste() {
        // Arrange
        Tarea tareaActualizada = new Tarea("Título actualizado", "Descripción actualizada", true);
        when(tareaRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Tarea resultado = tareaService.actualizarTarea(999L, tareaActualizada);

        // Assert
        assertNull(resultado);
        verify(tareaRepository, times(1)).findById(999L);
        verify(tareaRepository, never()).save(any(Tarea.class));
    }

    /**
     * Test: Eliminar tarea - Tarea existe
     */
    @Test
    void testEliminarTarea_TareaExiste() {
        // Arrange
        when(tareaRepository.existsById(1L)).thenReturn(true);
        doNothing().when(tareaRepository).deleteById(1L);

        // Act
        boolean resultado = tareaService.eliminarTarea(1L);

        // Assert
        assertTrue(resultado);
        verify(tareaRepository, times(1)).existsById(1L);
        verify(tareaRepository, times(1)).deleteById(1L);
    }

    /**
     * Test: Eliminar tarea - Tarea no existe
     */
    @Test
    void testEliminarTarea_TareaNoExiste() {
        // Arrange
        when(tareaRepository.existsById(999L)).thenReturn(false);

        // Act
        boolean resultado = tareaService.eliminarTarea(999L);

        // Assert
        assertFalse(resultado);
        verify(tareaRepository, times(1)).existsById(999L);
        verify(tareaRepository, never()).deleteById(any());
    }
}
