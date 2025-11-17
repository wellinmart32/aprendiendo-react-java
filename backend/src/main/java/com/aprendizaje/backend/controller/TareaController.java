package com.aprendizaje.backend.controller;

import com.aprendizaje.backend.model.Tarea;
import com.aprendizaje.backend.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para manejar las peticiones HTTP relacionadas con Tareas
 * @RestController indica que esta clase maneja peticiones HTTP y devuelve JSON
 * @RequestMapping define la ruta base /api/tareas
 */
@RestController
@RequestMapping("/api/tareas")
public class TareaController {
    
    /**
     * Inyección del servicio de tareas
     */
    @Autowired
    private TareaService tareaService;
    
    /**
     * GET /api/tareas - Obtiene todas las tareas
     * @return lista de todas las tareas en formato JSON
     */
    @GetMapping
    public ResponseEntity<List<Tarea>> obtenerTodasLasTareas() {
        // Llama al servicio para obtener todas las tareas
        List<Tarea> tareas = tareaService.obtenerTodasLasTareas();
        // Retorna la lista con código HTTP 200 OK
        return ResponseEntity.ok(tareas);
    }
    
    /**
     * GET /api/tareas/{id} - Obtiene una tarea por su ID
     * @param id - identificador de la tarea
     * @return la tarea si existe, o 404 Not Found si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtenerTareaPorId(@PathVariable Long id) {
        // Llama al servicio para buscar la tarea
        Optional<Tarea> tarea = tareaService.obtenerTareaPorId(id);
        
        // Si existe, retorna la tarea con código 200
        // Si no existe, retorna 404 Not Found
        return tarea.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * POST /api/tareas - Crea una nueva tarea
     * @param tarea - datos de la tarea a crear (viene en el body del request)
     * @return la tarea creada con código HTTP 201 Created
     */
    @PostMapping
    public ResponseEntity<Tarea> crearTarea(@RequestBody Tarea tarea) {
        // Llama al servicio para crear la tarea
        Tarea nuevaTarea = tareaService.crearTarea(tarea);
        // Retorna la tarea creada con código 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }
    
    /**
     * PUT /api/tareas/{id} - Actualiza una tarea existente
     * @param id - identificador de la tarea a actualizar
     * @param tarea - nuevos datos de la tarea
     * @return la tarea actualizada, o 404 si no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizarTarea(@PathVariable Long id, 
                                                  @RequestBody Tarea tarea) {
        // Llama al servicio para actualizar
        Tarea tareaActualizada = tareaService.actualizarTarea(id, tarea);
        
        // Si se actualizó, retorna la tarea con código 200
        // Si no existe, retorna 404 Not Found
        if (tareaActualizada != null) {
            return ResponseEntity.ok(tareaActualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * DELETE /api/tareas/{id} - Elimina una tarea
     * @param id - identificador de la tarea a eliminar
     * @return 204 No Content si se eliminó, o 404 si no existe
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        // Llama al servicio para eliminar
        boolean eliminado = tareaService.eliminarTarea(id);
        
        // Si se eliminó, retorna 204 No Content
        // Si no existía, retorna 404 Not Found
        if (eliminado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * PUT /api/tareas/{id}/completar - Marca una tarea como completada
     * @param id - identificador de la tarea
     * @return la tarea actualizada, o 404 si no existe
     */
    @PutMapping("/{id}/completar")
    public ResponseEntity<Tarea> completarTarea(@PathVariable Long id) {
        // Obtener la tarea
        Optional<Tarea> tareaExistente = tareaService.obtenerTareaPorId(id);
        
        if (tareaExistente.isPresent()) {
            Tarea tarea = tareaExistente.get();
            // Marcar como completada
            tarea.setCompletada(true);
            // Guardar
            Tarea tareaActualizada = tareaService.actualizarTarea(id, tarea);
            return ResponseEntity.ok(tareaActualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * PUT /api/tareas/{id}/descompletar - Marca una tarea como no completada
     * @param id - identificador de la tarea
     * @return la tarea actualizada, o 404 si no existe
     */
    @PutMapping("/{id}/descompletar")
    public ResponseEntity<Tarea> descompletarTarea(@PathVariable Long id) {
        // Obtener la tarea
        Optional<Tarea> tareaExistente = tareaService.obtenerTareaPorId(id);
        
        if (tareaExistente.isPresent()) {
            Tarea tarea = tareaExistente.get();
            // Marcar como no completada
            tarea.setCompletada(false);
            // Guardar
            Tarea tareaActualizada = tareaService.actualizarTarea(id, tarea);
            return ResponseEntity.ok(tareaActualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
