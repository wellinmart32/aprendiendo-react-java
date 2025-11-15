package com.aprendizaje.backend.service;

import com.aprendizaje.backend.model.Tarea;
import com.aprendizaje.backend.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio que contiene la lógica de negocio para las Tareas
 * @Service indica que esta clase es un servicio de Spring
 */
@Service
public class TareaService {
    
    /**
     * Inyección de dependencias del repositorio
     * @Autowired indica que Spring debe inyectar automáticamente el repositorio
     */
    @Autowired
    private TareaRepository tareaRepository;
    
    /**
     * Obtiene todas las tareas de la base de datos
     * @return lista de todas las tareas
     */
    public List<Tarea> obtenerTodasLasTareas() {
        // Llama al método findAll() del repositorio
        return tareaRepository.findAll();
    }
    
    /**
     * Obtiene una tarea por su ID
     * @param id - identificador de la tarea
     * @return Optional con la tarea si existe, vacío si no existe
     */
    public Optional<Tarea> obtenerTareaPorId(Long id) {
        // Llama al método findById() del repositorio
        return tareaRepository.findById(id);
    }
    
    /**
     * Crea una nueva tarea en la base de datos
     * @param tarea - tarea a crear
     * @return la tarea creada con su ID generado
     */
    public Tarea crearTarea(Tarea tarea) {
        // Llama al método save() del repositorio
        return tareaRepository.save(tarea);
    }
    
    /**
     * Actualiza una tarea existente
     * @param id - identificador de la tarea a actualizar
     * @param tareaActualizada - datos actualizados de la tarea
     * @return la tarea actualizada, o null si no existe
     */
    public Tarea actualizarTarea(Long id, Tarea tareaActualizada) {
        // Verifica si la tarea existe
        Optional<Tarea> tareaExistente = tareaRepository.findById(id);
        
        if (tareaExistente.isPresent()) {
            // Si existe, actualiza los campos
            Tarea tarea = tareaExistente.get();
            tarea.setTitulo(tareaActualizada.getTitulo());
            tarea.setDescripcion(tareaActualizada.getDescripcion());
            tarea.setCompletada(tareaActualizada.getCompletada());
            
            // Guarda los cambios
            return tareaRepository.save(tarea);
        }
        
        // Si no existe, retorna null
        return null;
    }
    
    /**
     * Elimina una tarea por su ID
     * @param id - identificador de la tarea a eliminar
     * @return true si se eliminó, false si no existía
     */
    public boolean eliminarTarea(Long id) {
        // Verifica si existe
        if (tareaRepository.existsById(id)) {
            // Si existe, la elimina
            tareaRepository.deleteById(id);
            return true;
        }
        // Si no existe, retorna false
        return false;
    }
    
    /**
     * Marca una tarea como completada o no completada
     * @param id - identificador de la tarea
     * @param completada - true para marcar como completada, false para no completada
     * @return la tarea actualizada, o null si no existe
     */
    public Tarea cambiarEstadoTarea(Long id, Boolean completada) {
        // Busca la tarea
        Optional<Tarea> tareaExistente = tareaRepository.findById(id);
        
        if (tareaExistente.isPresent()) {
            // Si existe, cambia el estado
            Tarea tarea = tareaExistente.get();
            tarea.setCompletada(completada);
            
            // Guarda los cambios
            return tareaRepository.save(tarea);
        }
        
        // Si no existe, retorna null
        return null;
    }
}
