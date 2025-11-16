import React, { useState, useEffect } from 'react';
import productoService from '../services/productoService';
import ProductoFormulario from '../components/productos/ProductoFormulario';
import ProductoLista from '../components/productos/ProductoLista';
import styles from './ProductosPage.module.css';

/**
 * Página principal de gestión de productos
 * Orquesta todos los componentes relacionados con productos
 */
function ProductosPage() {
  // Estado para almacenar todos los productos
  const [productos, setProductos] = useState([]);
  // Estado para indicar si se están cargando los productos
  const [cargando, setCargando] = useState(false);

  /**
   * useEffect para cargar los productos cuando el componente se monta
   */
  useEffect(() => {
    cargarProductos();
  }, []);

  /**
   * Carga todos los productos desde el backend
   */
  const cargarProductos = async () => {
    try {
      setCargando(true);
      const datos = await productoService.obtenerTodos();
      setProductos(datos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar los productos');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Maneja cuando se crea un nuevo producto
   * @param {Object} nuevoProducto - El producto recién creado
   */
  const handleProductoCreado = (nuevoProducto) => {
    // Agregar el nuevo producto al estado
    setProductos([...productos, nuevoProducto]);
  };

  /**
   * Maneja cuando se actualiza un producto
   * @param {Object} productoActualizado - El producto con los datos actualizados
   */
  const handleProductoActualizado = (productoActualizado) => {
    // Actualizar el producto en el estado
    setProductos(productos.map(producto => 
      producto.id === productoActualizado.id ? productoActualizado : producto
    ));
  };

  /**
   * Maneja cuando se elimina un producto
   * @param {number} productoId - ID del producto eliminado
   */
  const handleProductoEliminado = (productoId) => {
    // Eliminar el producto del estado
    setProductos(productos.filter(producto => producto.id !== productoId));
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>🛒 Catálogo de Productos</h1>
        <p>Proyecto React + Spring Boot + PostgreSQL</p>
      </header>

      <div className={styles.contenedor}>
        {/* Componente del formulario */}
        <ProductoFormulario onProductoCreado={handleProductoCreado} />

        {/* Componente de la lista */}
        <ProductoLista
          productos={productos}
          onProductoActualizado={handleProductoActualizado}
          onProductoEliminado={handleProductoEliminado}
          cargando={cargando}
        />
      </div>
    </div>
  );
}

export default ProductosPage;
