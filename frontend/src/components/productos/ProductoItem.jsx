import React from 'react';
import productoService from '../../services/productoService';
import styles from './ProductoItem.module.css';

/**
 * Componente que representa un producto individual
 * @param {Object} producto - Los datos del producto
 * @param {Function} onProductoActualizado - Callback cuando se actualiza el producto
 * @param {Function} onProductoEliminado - Callback cuando se elimina el producto
 */
function ProductoItem({ producto, onProductoActualizado, onProductoEliminado }) {

  /**
   * Elimina el producto después de confirmación
   */
  const handleEliminar = async () => {
    // Pedir confirmación
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await productoService.eliminar(producto.id);
      
      // Notificar al componente padre
      if (onProductoEliminado) {
        onProductoEliminado(producto.id);
      }

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  /**
   * Formatea el precio como moneda
   */
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(precio);
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

  /**
   * Determina si el producto tiene stock bajo
   */
  const tieneStockBajo = () => {
    return producto.stock < 10;
  };

  return (
    <div className={styles.producto}>
      <div className={styles.contenido}>
        <div className={styles.header}>
          <h3 className={styles.nombre}>{producto.nombre}</h3>
          {producto.categoria && (
            <span className={styles.categoria}>{producto.categoria}</span>
          )}
        </div>
        
        {producto.descripcion && (
          <p className={styles.descripcion}>{producto.descripcion}</p>
        )}
        
        <div className={styles.info}>
          <span className={styles.precio}>{formatearPrecio(producto.precio)}</span>
          <span className={`${styles.stock} ${tieneStockBajo() ? styles.stockBajo : ''}`}>
            Stock: {producto.stock}
          </span>
        </div>
        
        <small className={styles.fecha}>
          Creado: {formatearFecha(producto.fechaCreacion)}
        </small>
      </div>
      
      <div className={styles.acciones}>
        <button
          onClick={handleEliminar}
          className={`${styles.btn} ${styles.btnEliminar}`}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}

export default ProductoItem;
