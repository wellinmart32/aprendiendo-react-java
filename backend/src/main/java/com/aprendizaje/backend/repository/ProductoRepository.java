package com.aprendizaje.backend.repository;

import com.aprendizaje.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para acceder a los datos de Producto en la base de datos
 * JpaRepository proporciona métodos CRUD automáticamente:
 * - save() - guardar o actualizar
 * - findById() - buscar por ID
 * - findAll() - obtener todos los productos
 * - deleteById() - eliminar por ID
 * - count() - contar registros
 * Y muchos más...
 * 
 * @Repository indica que esta interfaz es un repositorio de Spring
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // JpaRepository<Producto, Long> significa:
    // - Producto: la entidad que manejamos
    // - Long: el tipo de dato del ID
    
    /**
     * Busca productos por categoría
     * Spring Data JPA genera automáticamente la implementación
     * @param categoria - categoría a buscar
     * @return lista de productos de esa categoría
     */
    List<Producto> findByCategoria(String categoria);
    
    /**
     * Busca productos cuyo nombre contenga el texto dado (ignorando mayúsculas/minúsculas)
     * @param nombre - texto a buscar en el nombre
     * @return lista de productos que coinciden
     */
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
    /**
     * Busca productos con stock mayor o igual al valor dado
     * @param stock - cantidad mínima de stock
     * @return lista de productos con suficiente stock
     */
    List<Producto> findByStockGreaterThanEqual(Integer stock);
}
