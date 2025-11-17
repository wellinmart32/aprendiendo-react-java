import React, { useState, useEffect } from 'react';
import tareaService from '../../services/tareaService';
import styles from './TareaFormulario.module.css';

/**
 * Componente formulario para editar tareas existentes
 * @param {Object} tarea - Tarea a editar
 * @param {Function} onTareaActualizada - Callback que se ejecuta cuando se actualiza una tarea
 * @param {Function} onCancelar - Callback para cancelar la edición
 */
function TareaFormularioEditar({ tarea, onTareaActualizada, onCancelar }) {
  // Estados para los campos del formulario (inicializados con los valores de la tarea)
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [descripcion, setDescripcion] = useState(tarea.descripcion || '');
  const [cargando, setCargando] = useState(false);

  /**
   * useEffect para actualizar los campos si cambia la tarea
   */
  useEffect(() => {
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion || '');
  }, [tarea]);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    // Validar que el título no esté vacío
    if (!titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      setCargando(true);
      
      // Actualizar la tarea usando el servicio
      const tareaActualizada = await tareaService.actualizar(tarea.id, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        completada: tarea.completada
      });

      // Notificar al componente padre que se actualizó la tarea
      if (onTareaActualizada) {
        onTareaActualizada(tareaActualizada);
      }

    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Título de la tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className={styles.inputTitulo}
        disabled={cargando}
      />
      
      <textarea
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className={styles.inputDescripcion}
        disabled={cargando}
      />
      
      <div className={styles.botonesModal}>
        <button 
          type="submit" 
          className={styles.btnCrear}
          disabled={cargando}
        >
          {cargando ? 'Actualizando...' : 'Guardar Cambios'}
        </button>
        
        <button 
          type="button"
          onClick={onCancelar}
          className={styles.btnCancelar}
          disabled={cargando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default TareaFormularioEditar;
