import React from 'react';
import styles from './ConfirmModal.module.css';

/**
 * Componente Modal de confirmación reutilizable
 * Muestra un diálogo para confirmar acciones destructivas
 * @param {boolean} isOpen - Indica si el modal está abierto
 * @param {Function} onClose - Callback para cerrar/cancelar
 * @param {Function} onConfirm - Callback para confirmar la acción
 * @param {string} titulo - Título del modal
 * @param {string} mensaje - Mensaje descriptivo
 * @param {string} textoConfirmar - Texto del botón confirmar (default: "Confirmar")
 * @param {string} textoCancelar - Texto del botón cancelar (default: "Cancelar")
 */
function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titulo = "¿Estás seguro?",
  mensaje = "Esta acción no se puede deshacer.",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar"
}) {
  
  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  /**
   * Cierra el modal si se hace clic en el fondo oscuro
   */
  const handleBackdropClick = (e) => {
    // Solo cerrar si se hace clic en el fondo, no en el contenido
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Maneja la confirmación
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.icono}>⚠️</div>
        
        <h2 className={styles.titulo}>{titulo}</h2>
        
        <p className={styles.mensaje}>{mensaje}</p>
        
        <div className={styles.botones}>
          <button 
            className={styles.btnCancelar}
            onClick={onClose}
          >
            {textoCancelar}
          </button>
          
          <button 
            className={styles.btnConfirmar}
            onClick={handleConfirm}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
