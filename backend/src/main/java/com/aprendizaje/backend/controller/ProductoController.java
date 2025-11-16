package com.aprendizaje.backend.controller;

import com.aprendizaje.backend.model.Producto;
import com.aprendizaje.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para manejar las peticiones HTTP relacionadas con Productos
 * @RestController indica que esta clase maneja peticiones HTTP y devuelve JSON
 * @RequestMapping define la ruta base /api/productos
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    
    /**
     * Inyección del servicio de productos
     */
    @Autowired
    private ProductoService productoService;
    
    /**
     * GET /api/productos - Obtiene todos los productos
     * @return lista de todos los productos en formato JSON
     */
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodosLosProductos() {
        // Llama al servicio para obtener todos los productos
        List<Producto> productos = productoService.obtenerTodosLosProductos();
        // Retorna la lista con código HTTP 200 OK
        return ResponseEntity.ok(productos);
    }
    
    /**
     * GET /api/productos/{id} - Obtiene un producto por su ID
     * @param id - identificador del producto
     * @return el producto si existe, o 404 Not Found si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        // Llama al servicio para buscar el producto
        Optional<Producto> producto = productoService.obtenerProductoPorId(id);
        
        // Si existe, retorna el producto con código 200
        // Si no existe, retorna 404 Not Found
        return producto.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * POST /api/productos - Crea un nuevo producto
     * @param producto - datos del producto a crear (viene en el body del request)
     * @return el producto creado con código HTTP 201 Created
     */
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        // Llama al servicio para crear el producto
        Producto nuevoProducto = productoService.crearProducto(producto);
        // Retorna el producto creado con código 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }
    
    /**
     * PUT /api/productos/{id} - Actualiza un producto existente
     * @param id - identificador del producto a actualizar
     * @param producto - nuevos datos del producto
     * @return el producto actualizado, o 404 si no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, 
                                                        @RequestBody Producto producto) {
        // Llama al servicio para actualizar
        Producto productoActualizado = productoService.actualizarProducto(id, producto);
        
        // Si se actualizó, retorna el producto con código 200
        // Si no existe, retorna 404 Not Found
        if (productoActualizado != null) {
            return ResponseEntity.ok(productoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * DELETE /api/productos/{id} - Elimina un producto
     * @param id - identificador del producto a eliminar
     * @return 204 No Content si se eliminó, o 404 si no existe
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        // Llama al servicio para eliminar
        boolean eliminado = productoService.eliminarProducto(id);
        
        // Si se eliminó, retorna 204 No Content
        // Si no existía, retorna 404 Not Found
        if (eliminado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * GET /api/productos/buscar?nombre=texto - Busca productos por nombre
     * @param nombre - texto a buscar en el nombre del producto
     * @return lista de productos que coinciden con la búsqueda
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarPorNombre(@RequestParam String nombre) {
        // Llama al servicio para buscar por nombre
        List<Producto> productos = productoService.buscarPorNombre(nombre);
        return ResponseEntity.ok(productos);
    }
    
    /**
     * GET /api/productos/categoria/{categoria} - Obtiene productos por categoría
     * @param categoria - categoría a buscar
     * @return lista de productos de esa categoría
     */
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> obtenerPorCategoria(@PathVariable String categoria) {
        // Llama al servicio para buscar por categoría
        List<Producto> productos = productoService.buscarPorCategoria(categoria);
        return ResponseEntity.ok(productos);
    }
    
    /**
     * GET /api/productos/stock/{minimo} - Obtiene productos con stock mínimo
     * @param minimo - cantidad mínima de stock
     * @return lista de productos con stock suficiente
     */
    @GetMapping("/stock/{minimo}")
    public ResponseEntity<List<Producto>> obtenerConStock(@PathVariable Integer minimo) {
        // Llama al servicio para obtener productos con stock
        List<Producto> productos = productoService.obtenerProductosConStock(minimo);
        return ResponseEntity.ok(productos);
    }
}
