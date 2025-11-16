package com.aprendizaje.backend.service;

import com.aprendizaje.backend.model.Producto;
import com.aprendizaje.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio que contiene la lógica de negocio para los Productos
 * @Service indica que esta clase es un servicio de Spring
 */
@Service
public class ProductoService {
    
    /**
     * Inyección de dependencias del repositorio
     * @Autowired indica que Spring debe inyectar automáticamente el repositorio
     */
    @Autowired
    private ProductoRepository productoRepository;
    
    /**
     * Obtiene todos los productos de la base de datos
     * @return lista de todos los productos
     */
    public List<Producto> obtenerTodosLosProductos() {
        // Llama al método findAll() del repositorio
        return productoRepository.findAll();
    }
    
    /**
     * Obtiene un producto por su ID
     * @param id - identificador del producto
     * @return Optional con el producto si existe, vacío si no existe
     */
    public Optional<Producto> obtenerProductoPorId(Long id) {
        // Llama al método findById() del repositorio
        return productoRepository.findById(id);
    }
    
    /**
     * Crea un nuevo producto en la base de datos
     * @param producto - producto a crear
     * @return el producto creado con su ID generado
     */
    public Producto crearProducto(Producto producto) {
        // Llama al método save() del repositorio
        return productoRepository.save(producto);
    }
    
    /**
     * Actualiza un producto existente
     * @param id - identificador del producto a actualizar
     * @param productoActualizado - datos actualizados del producto
     * @return el producto actualizado, o null si no existe
     */
    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        // Verifica si el producto existe
        Optional<Producto> productoExistente = productoRepository.findById(id);
        
        if (productoExistente.isPresent()) {
            // Si existe, actualiza los campos
            Producto producto = productoExistente.get();
            producto.setNombre(productoActualizado.getNombre());
            producto.setDescripcion(productoActualizado.getDescripcion());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setStock(productoActualizado.getStock());
            producto.setCategoria(productoActualizado.getCategoria());
            
            // Guarda los cambios
            return productoRepository.save(producto);
        }
        
        // Si no existe, retorna null
        return null;
    }
    
    /**
     * Elimina un producto por su ID
     * @param id - identificador del producto a eliminar
     * @return true si se eliminó, false si no existía
     */
    public boolean eliminarProducto(Long id) {
        // Verifica si existe
        if (productoRepository.existsById(id)) {
            // Si existe, lo elimina
            productoRepository.deleteById(id);
            return true;
        }
        // Si no existe, retorna false
        return false;
    }
    
    /**
     * Busca productos por categoría
     * @param categoria - categoría a buscar
     * @return lista de productos de esa categoría
     */
    public List<Producto> buscarPorCategoria(String categoria) {
        // Usa el método personalizado del repositorio
        return productoRepository.findByCategoria(categoria);
    }
    
    /**
     * Busca productos por nombre (búsqueda parcial)
     * @param nombre - texto a buscar en el nombre
     * @return lista de productos que coinciden
     */
    public List<Producto> buscarPorNombre(String nombre) {
        // Usa el método personalizado del repositorio
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    /**
     * Obtiene productos con stock disponible
     * @param stockMinimo - cantidad mínima de stock requerida
     * @return lista de productos con stock suficiente
     */
    public List<Producto> obtenerProductosConStock(Integer stockMinimo) {
        // Usa el método personalizado del repositorio
        return productoRepository.findByStockGreaterThanEqual(stockMinimo);
    }
}
