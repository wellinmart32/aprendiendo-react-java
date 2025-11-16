package com.aprendizaje.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa un Producto en la base de datos
 * @Entity indica que esta clase es una tabla en la base de datos
 */
@Entity
@Table(name = "productos")
public class Producto {
    
    /**
     * Identificador único del producto
     * @Id indica que es la clave primaria
     * @GeneratedValue indica que se genera automáticamente
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Nombre del producto
     * @Column define características de la columna en la base de datos
     */
    @Column(nullable = false, length = 100)
    private String nombre;
    
    /**
     * Descripción detallada del producto
     */
    @Column(length = 500)
    private String descripcion;
    
    /**
     * Precio del producto
     */
    @Column(nullable = false)
    private Double precio;
    
    /**
     * Cantidad disponible en inventario
     */
    @Column(nullable = false)
    private Integer stock;
    
    /**
     * Categoría a la que pertenece el producto
     */
    @Column(length = 50)
    private String categoria;
    
    /**
     * Fecha y hora de creación del producto
     */
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    /**
     * Constructor vacío requerido por JPA
     */
    public Producto() {
        this.fechaCreacion = LocalDateTime.now();
        this.stock = 0;
    }
    
    /**
     * Constructor con parámetros para crear un producto
     */
    public Producto(String nombre, String descripcion, Double precio, Integer stock, String categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.fechaCreacion = LocalDateTime.now();
    }
    
    // ========== GETTERS Y SETTERS ==========
    
    /**
     * Obtiene el ID del producto
     * @return id del producto
     */
    public Long getId() {
        return id;
    }
    
    /**
     * Establece el ID del producto
     * @param id - nuevo id
     */
    public void setId(Long id) {
        this.id = id;
    }
    
    /**
     * Obtiene el nombre del producto
     * @return nombre
     */
    public String getNombre() {
        return nombre;
    }
    
    /**
     * Establece el nombre del producto
     * @param nombre - nuevo nombre
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    /**
     * Obtiene la descripción del producto
     * @return descripción
     */
    public String getDescripcion() {
        return descripcion;
    }
    
    /**
     * Establece la descripción del producto
     * @param descripcion - nueva descripción
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    /**
     * Obtiene el precio del producto
     * @return precio
     */
    public Double getPrecio() {
        return precio;
    }
    
    /**
     * Establece el precio del producto
     * @param precio - nuevo precio
     */
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    
    /**
     * Obtiene el stock disponible
     * @return cantidad en stock
     */
    public Integer getStock() {
        return stock;
    }
    
    /**
     * Establece el stock disponible
     * @param stock - nueva cantidad
     */
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    /**
     * Obtiene la categoría del producto
     * @return categoría
     */
    public String getCategoria() {
        return categoria;
    }
    
    /**
     * Establece la categoría del producto
     * @param categoria - nueva categoría
     */
    public void setCategoria(String categoria) {
        this.categoria = categoria;
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
