// URL base de la API
const API_URL = 'http://localhost:8080/api/tareas';

/**
 * Servicio para manejar todas las operaciones relacionadas con Tareas
 * Centraliza las llamadas HTTP al backend
 */
const tareaService = {
  
  /**
   * Obtiene todas las tareas del backend
   * @returns {Promise<Array>} Lista de tareas
   */
  obtenerTodas: async () => {
    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error('Error al obtener las tareas');
      }
      return await respuesta.json();
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva tarea
   * @param {Object} tarea - Datos de la tarea a crear
   * @returns {Promise<Object>} La tarea creada
   */
  crear: async (tarea) => {
    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea)
      });
      
      if (!respuesta.ok) {
        throw new Error('Error al crear la tarea');
      }
      
      return await respuesta.json();
    } catch (error) {
      console.error('Error en crear:', error);
      throw error;
    }
  },

  /**
   * Elimina una tarea
   * @param {number} id - ID de la tarea a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  eliminar: async (id) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!respuesta.ok && respuesta.status !== 204) {
        throw new Error('Error al eliminar la tarea');
      }
      
      return true;
    } catch (error) {
      console.error('Error en eliminar:', error);
      throw error;
    }
  },

  /**
   * Actualiza una tarea existente
   * @param {number} id - ID de la tarea a actualizar
   * @param {Object} tarea - Nuevos datos de la tarea
   * @returns {Promise<Object>} La tarea actualizada
   */
  actualizar: async (id, tarea) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea)
      });
      
      if (!respuesta.ok) {
        throw new Error('Error al actualizar la tarea');
      }
      
      return await respuesta.json();
    } catch (error) {
      console.error('Error en actualizar:', error);
      throw error;
    }
  },

  /**
   * Marca una tarea como completada
   * @param {number} id - ID de la tarea a completar
   * @returns {Promise<Object>} La tarea actualizada
   */
  completar: async (id) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}/completar`, {
        method: 'PUT'
      });
      
      if (!respuesta.ok) {
        throw new Error('Error al completar la tarea');
      }
      
      return await respuesta.json();
    } catch (error) {
      console.error('Error en completar:', error);
      throw error;
    }
  },

  /**
   * Marca una tarea como no completada
   * @param {number} id - ID de la tarea a descompletar
   * @returns {Promise<Object>} La tarea actualizada
   */
  descompletar: async (id) => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}/descompletar`, {
        method: 'PUT'
      });
      
      if (!respuesta.ok) {
        throw new Error('Error al descompletar la tarea');
      }
      
      return await respuesta.json();
    } catch (error) {
      console.error('Error en descompletar:', error);
      throw error;
    }
  }
};

// Exportar el servicio para usarlo en otros archivos
export default tareaService;
