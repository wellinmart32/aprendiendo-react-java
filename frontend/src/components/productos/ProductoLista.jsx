import React from 'react';
import ProductoItem from './ProductoItem';
import styles from './ProductoLista.module.css';

/**
 * Componente que muestra la lista de todos los productos
 * @param {Array} productos - Array con todos los productos
 * @param {Function} onProductoActualizado - Callback cuando se actualiza un producto
 * @param {Function} onProductoEliminado - Callback cuando se elimina un producto
 * @param {boolean} cargando - Indica si se están cargando los productos
 */
function ProductoLista({ productos, onProductoActualizado, onProductoEliminado, cargando }) {

  // Mostrar mensaje de carga
  if (cargando) {
    return (
      <div className={styles.listaProductos}>
        <h2 className={styles.titulo}>🛒 Mis Productos</h2>
        <p className={styles.mensajeCarga}>Cargando productos...</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay productos
  if (!productos || productos.length === 0) {
    return (
      <div className={styles.listaProductos}>
        <h2 className={styles.titulo}>🛒 Mis Productos (0)</h2>
        <p className={styles.sinProductos}>No hay productos. ¡Crea uno nuevo!</p>
      </div>
    );
  }

  return (
    <div className={styles.listaProductos}>
      <h2 className={styles.titulo}>🛒 Mis Productos ({productos.length})</h2>
      
      {/* Mapear cada producto a un componente ProductoItem */}
      {productos.map((producto) => (
        <ProductoItem
          key={producto.id}
          producto={producto}
          onProductoActualizado={onProductoActualizado}
          onProductoEliminado={onProductoEliminado}
        />
      ))}
    </div>
  );
}

export default ProductoLista;
