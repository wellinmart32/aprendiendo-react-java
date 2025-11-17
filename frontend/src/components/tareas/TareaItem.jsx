import React, { useState } from 'react';
import tareaService from '../../services/tareaService';
import Modal from '../common/Modal';
import TareaFormularioEditar from './TareaFormularioEditar';
import styles from './TareaItem.module.css';

/**
 * Componente que representa una tarea individual
 * @param {Object} tarea - Los datos de la tarea
 * @param {Function} onTareaActualizada - Callback cuando se actualiza la tarea
 * @param {Function} onTareaEliminada - Callback cuando se elimina la tarea
 */
function TareaItem({ tarea, onTareaActualizada, onTareaEliminada }) {
  // Estado para controlar si el modal está abierto
  const [modalAbierto, setModalAbierto] = useState(false);

  /**
   * Alterna el estado de completada de la tarea
   */
  const handleToggleCompletada = async () => {
    try {
      let tareaActualizada;
      
      // Llamar al servicio apropiado según el estado actual
      if (tarea.completada) {
        tareaActualizada = await tareaService.descompletar(tarea.id);
      } else {
        tareaActualizada = await tareaService.completar(tarea.id);
      }

      // Notificar al componente padre
      if (onTareaActualizada) {
        onTareaActualizada(tareaActualizada);
      }

    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea');
    }
  };

  /**
   * Elimina la tarea después de confirmación
   */
  const handleEliminar = async () => {
    // Pedir confirmación
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      return;
    }

    try {
      await tareaService.eliminar(tarea.id);
      
      // Notificar al componente padre
      if (onTareaEliminada) {
        onTareaEliminada(tarea.id);
      }

    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
    }
  };

  /**
   * Abre el modal de edición
   */
  const handleAbrirModal = () => {
    setModalAbierto(true);
  };

  /**
   * Cierra el modal de edición
   */
  const handleCerrarModal = () => {
    setModalAbierto(false);
  };

  /**
   * Maneja cuando se actualiza la tarea
   */
  const handleTareaActualizada = (tareaActualizada) => {
    // Notificar al componente padre
    if (onTareaActualizada) {
      onTareaActualizada(tareaActualizada);
    }
    
    // Cerrar el modal
    setModalAbierto(false);
  };

  /**
   * Formatea la fecha de creación
   */
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className={`${styles.tarea} ${tarea.completada ? styles.completada : ''}`}>
        <div className={styles.contenido}>
          <h3 className={styles.titulo}>{tarea.titulo}</h3>
          {tarea.descripcion && <p className={styles.descripcion}>{tarea.descripcion}</p>}
          <small className={styles.fecha}>Creada: {formatearFecha(tarea.fechaCreacion)}</small>
        </div>
        
        <div className={styles.acciones}>
          <button
            onClick={handleAbrirModal}
            className={`${styles.btn} ${styles.btnEditar}`}
          >
            ✏️ Editar
          </button>

          <button
            onClick={handleToggleCompletada}
            className={`${styles.btn} ${tarea.completada ? styles.btnDescompletar : styles.btnCompletar}`}
          >
            {tarea.completada ? '↩️ Descompletar' : '✅ Completar'}
          </button>
          
          <button
            onClick={handleEliminar}
            className={`${styles.btn} ${styles.btnEliminar}`}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      <Modal 
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        titulo="Editar Tarea"
      >
        <TareaFormularioEditar
          tarea={tarea}
          onTareaActualizada={handleTareaActualizada}
          onCancelar={handleCerrarModal}
        />
      </Modal>
    </>
  );
}

export default TareaItem;
