// URL base de la API
const API_URL = 'http://localhost:8080/api/productos';

/**
 * Servicio para manejar todas las operaciones relacionadas con Productos
 * Centraliza las llamadas HTTP al backend
 */
const productoService = {
  
  /**
   * Obtiene todos los productos del backend
   * @returns {Promise<Array>} Lista de productos
   */
  obtenerTodos: async () => {
    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error('Error al obtener los productos');
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un producto por su ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} El producto encontrado
   */
  obtenerPorId: async (id) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`);
      if (!respuesta.ok) {
        throw new Error('Producto no encontrado');
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo producto
   * @param {Object} producto - Datos del producto a crear
   * @returns {Promise<Object>} El producto creado
   */
  crear: async (producto) => {
    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto)
      });
      
      if (!respuesta.ok) {
        throw new Error('Error al crear el producto');
      }
      
      return await respuesta.json();
    } catch (error) {
      console.error('Error en crear:', error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto a actualizar
   * @param {Object} producto - Nuevos datos del producto
   * @returns {Promise<Object>} El producto actualizado
   */
  actualizar: async (id, producto) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto)
      });
      
      if (!respuesta.ok) {
        throw new Error('Error al actualizar el producto');
      }
      
      return await respuesta.json();
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    }
  },

  /**
   * Elimina un producto
   * @param {number} id - ID del producto a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  eliminar: async (id) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!respuesta.ok && respuesta.status !== 204) {
        throw new Error('Error al eliminar el producto');
      }
      
      return true;
    } catch (error) {
      console.error('Error en eliminar:', error);
      throw error;
    }
  },

  /**
   * Busca productos por nombre
   * @param {string} nombre - Texto a buscar en el nombre
   * @returns {Promise<Array>} Lista de productos que coinciden
   */
  buscarPorNombre: async (nombre) => {
    try {
      const respuesta = await fetch(`${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`);
      if (!respuesta.ok) {
        throw new Error('Error al buscar productos');
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error en buscarPorNombre:', error);
      throw error;
    }
  },

  /**
   * Obtiene productos por categoría
   * @param {string} categoria - Categoría a buscar
   * @returns {Promise<Array>} Lista de productos de esa categoría
   */
  obtenerPorCategoria: async (categoria) => {
    try {
      const respuesta = await fetch(`${API_URL}/categoria/${encodeURIComponent(categoria)}`);
      if (!respuesta.ok) {
        throw new Error('Error al obtener productos por categoría');
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error en obtenerPorCategoria:', error);
      throw error;
    }
  },

  /**
   * Obtiene productos con stock mínimo
   * @param {number} stockMinimo - Cantidad mínima de stock
   * @returns {Promise<Array>} Lista de productos con stock suficiente
   */
  obtenerConStock: async (stockMinimo) => {
    try {
      const respuesta = await fetch(`${API_URL}/stock/${stockMinimo}`);
      if (!respuesta.ok) {
        throw new Error('Error al obtener productos con stock');
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error en obtenerConStock:', error);
      throw error;
    }
  }
};

// Exportar el servicio para usarlo en otros archivos
export default productoService;
