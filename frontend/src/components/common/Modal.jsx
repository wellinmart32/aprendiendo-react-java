import React from 'react';
import styles from './Modal.module.css';

/**
 * Componente Modal reutilizable
 * Muestra una ventana emergente encima del contenido
 * @param {boolean} isOpen - Indica si el modal está abierto
 * @param {Function} onClose - Callback para cerrar el modal
 * @param {string} titulo - Título del modal
 * @param {ReactNode} children - Contenido del modal
 */
function Modal({ isOpen, onClose, titulo, children }) {
  
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

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo}</h2>
          <button 
            className={styles.btnCerrar}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
        
        <div className={styles.contenido}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
