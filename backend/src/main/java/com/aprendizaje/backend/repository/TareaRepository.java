package com.aprendizaje.backend.repository;

import com.aprendizaje.backend.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para acceder a los datos de Tarea en la base de datos
 * JpaRepository proporciona métodos CRUD automáticamente:
 * - save() - guardar o actualizar
 * - findById() - buscar por ID
 * - findAll() - obtener todas las tareas
 * - deleteById() - eliminar por ID
 * - count() - contar registros
 * Y muchos más...
 * 
 * @Repository indica que esta interfaz es un repositorio de Spring
 */
@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // JpaRepository<Tarea, Long> significa:
    // - Tarea: la entidad que manejamos
    // - Long: el tipo de dato del ID
    
    // Aquí no necesitamos escribir código
    // Spring Data JPA genera automáticamente la implementación
}
