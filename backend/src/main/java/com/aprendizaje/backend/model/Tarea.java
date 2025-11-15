package com.aprendizaje.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa una Tarea en la base de datos
 * @Entity indica que esta clase es una tabla en la base de datos
 */
@Entity
@Table(name = "tareas")
public class Tarea {
    
    /**
     * Identificador único de la tarea
     * @Id indica que es la clave primaria
     * @GeneratedValue indica que se genera automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Título de la tarea
     * @Column define características de la columna en la base de datos
     */
    @Column(nullable = false, length = 100)
    private String titulo;
    
    /**
     * Descripción detallada de la tarea
     */
    @Column(length = 500)
    private String descripcion;
    
    /**
     * Indica si la tarea está completada o no
     */
    @Column(nullable = false)
    private Boolean completada = false;
    
    /**
     * Fecha y hora de creación de la tarea
     */
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    /**
     * Constructor vacío requerido por JPA
     */
    public Tarea() {
        this.fechaCreacion = LocalDateTime.now();
        this.completada = false;
    }
    
    /**
     * Constructor con parámetros para crear una tarea
     */
    public Tarea(String titulo, String descripcion) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.completada = false;
        this.fechaCreacion = LocalDateTime.now();
    }
    
    // ========== GETTERS Y SETTERS ==========
    
    /**
     * Obtiene el ID de la tarea
     * @return id de la tarea
     */
    public Long getId() {
        return id;
    }
    
    /**
     * Establece el ID de la tarea
     * @param id - nuevo id
     */
    public void setId(Long id) {
        this.id = id;
    }
    
    /**
     * Obtiene el título de la tarea
     * @return título
     */
    public String getTitulo() {
        return titulo;
    }
    
    /**
     * Establece el título de la tarea
     * @param titulo - nuevo título
     */
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    /**
     * Obtiene la descripción de la tarea
     * @return descripción
     */
    public String getDescripcion() {
        return descripcion;
    }
    
    /**
     * Establece la descripción de la tarea
     * @param descripcion - nueva descripción
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    /**
     * Verifica si la tarea está completada
     * @return true si está completada, false si no
     */
    public Boolean getCompletada() {
        return completada;
    }
    
    /**
     * Establece el estado de completado de la tarea
     * @param completada - true o false
     */
    public void setCompletada(Boolean completada) {
        this.completada = completada;
    }
    
    /**
     * Obtiene la fecha de creación
     * @return fecha y hora de creación
     */
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    /**
     * Establece la fecha de creación
     * @param fechaCreacion - nueva fecha
     */
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
