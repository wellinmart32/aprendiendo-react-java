package com.aprendizaje.backend.controller;

import com.aprendizaje.backend.model.Tarea;
import com.aprendizaje.backend.service.TareaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para TareaController
 * Usa MockMvc para simular peticiones HTTP
 */
@WebMvcTest(TareaController.class)
class TareaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TareaService tareaService;

    @Autowired
    private ObjectMapper objectMapper;

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
     * Test: GET /api/tareas - Obtener todas las tareas
     */
    @Test
    void testObtenerTodasLasTareas() throws Exception {
        // Arrange
        List<Tarea> tareas = Arrays.asList(tarea1, tarea2);
        when(tareaService.obtenerTodasLasTareas()).thenReturn(tareas);

        // Act & Assert
        mockMvc.perform(get("/api/tareas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].titulo", is("Tarea de prueba 1")))
                .andExpect(jsonPath("$[1].titulo", is("Tarea de prueba 2")));

        verify(tareaService, times(1)).obtenerTodasLasTareas();
    }

    /**
     * Test: GET /api/tareas/{id} - Obtener tarea existente
     */
    @Test
    void testObtenerTareaPorId_TareaExiste() throws Exception {
        // Arrange
        when(tareaService.obtenerTareaPorId(1L)).thenReturn(Optional.of(tarea1));

        // Act & Assert
        mockMvc.perform(get("/api/tareas/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.titulo", is("Tarea de prueba 1")))
                .andExpect(jsonPath("$.completada", is(false)));

        verify(tareaService, times(1)).obtenerTareaPorId(1L);
    }

    /**
     * Test: GET /api/tareas/{id} - Tarea no encontrada
     */
    @Test
    void testObtenerTareaPorId_TareaNoExiste() throws Exception {
        // Arrange
        when(tareaService.obtenerTareaPorId(999L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/tareas/999"))
                .andExpect(status().isNotFound());

        verify(tareaService, times(1)).obtenerTareaPorId(999L);
    }

    /**
     * Test: POST /api/tareas - Crear nueva tarea
     */
    @Test
    void testCrearTarea() throws Exception {
        // Arrange
        Tarea nuevaTarea = new Tarea("Nueva tarea", "Descripción nueva", false);
        Tarea tareaCreada = new Tarea("Nueva tarea", "Descripción nueva", false);
        tareaCreada.setId(3L);
        tareaCreada.setFechaCreacion(LocalDateTime.now());

        when(tareaService.crearTarea(any(Tarea.class))).thenReturn(tareaCreada);

        // Act & Assert
        mockMvc.perform(post("/api/tareas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevaTarea)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.titulo", is("Nueva tarea")))
                .andExpect(jsonPath("$.completada", is(false)));

        verify(tareaService, times(1)).crearTarea(any(Tarea.class));
    }

    /**
     * Test: PUT /api/tareas/{id} - Actualizar tarea existente
     */
    @Test
    void testActualizarTarea_TareaExiste() throws Exception {
        // Arrange
        Tarea tareaActualizada = new Tarea("Título actualizado", "Descripción actualizada", true);
        tareaActualizada.setId(1L);
        tareaActualizada.setFechaCreacion(LocalDateTime.now());

        when(tareaService.actualizarTarea(eq(1L), any(Tarea.class))).thenReturn(tareaActualizada);

        // Act & Assert
        mockMvc.perform(put("/api/tareas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tareaActualizada)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo", is("Título actualizado")))
                .andExpect(jsonPath("$.completada", is(true)));

        verify(tareaService, times(1)).actualizarTarea(eq(1L), any(Tarea.class));
    }

    /**
     * Test: PUT /api/tareas/{id} - Tarea no encontrada
     */
    @Test
    void testActualizarTarea_TareaNoExiste() throws Exception {
        // Arrange
        Tarea tareaActualizada = new Tarea("Título actualizado", "Descripción actualizada", true);
        when(tareaService.actualizarTarea(eq(999L), any(Tarea.class))).thenReturn(null);

        // Act & Assert
        mockMvc.perform(put("/api/tareas/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tareaActualizada)))
                .andExpect(status().isNotFound());

        verify(tareaService, times(1)).actualizarTarea(eq(999L), any(Tarea.class));
    }

    /**
     * Test: DELETE /api/tareas/{id} - Eliminar tarea existente
     */
    @Test
    void testEliminarTarea_TareaExiste() throws Exception {
        // Arrange
        when(tareaService.eliminarTarea(1L)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/tareas/1"))
                .andExpect(status().isNoContent());

        verify(tareaService, times(1)).eliminarTarea(1L);
    }

    /**
     * Test: DELETE /api/tareas/{id} - Tarea no encontrada
     */
    @Test
    void testEliminarTarea_TareaNoExiste() throws Exception {
        // Arrange
        when(tareaService.eliminarTarea(999L)).thenReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/tareas/999"))
                .andExpect(status().isNotFound());

        verify(tareaService, times(1)).eliminarTarea(999L);
    }
}
