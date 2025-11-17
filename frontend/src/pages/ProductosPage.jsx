import React, { useState, useEffect, useCallback } from 'react';
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
  // Estado para la búsqueda
  const [busqueda, setBusqueda] = useState('');
  // Estado para indicar si se están cargando los productos
  const [cargando, setCargando] = useState(false);

  /**
   * Carga todos los productos desde el backend
   */
  const cargarProductos = useCallback(async () => {
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
  }, []);

  /**
   * Busca productos por nombre
   */
  const buscarProductos = useCallback(async () => {
    try {
      setCargando(true);
      const datos = await productoService.buscarPorNombre(busqueda.trim());
      setProductos(datos);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      alert('Error al buscar productos');
    } finally {
      setCargando(false);
    }
  }, [busqueda]);

  /**
   * useEffect para cargar los productos cuando el componente se monta
   */
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  /**
   * useEffect para buscar productos cuando cambia el término de búsqueda
   */
  useEffect(() => {
    if (busqueda.trim()) {
      buscarProductos();
    } else {
      cargarProductos();
    }
  }, [busqueda, buscarProductos, cargarProductos]);

  /**
   * Maneja cuando se crea un nuevo producto
   * @param {Object} nuevoProducto - El producto recién creado
   */
  const handleProductoCreado = (nuevoProducto) => {
    // Si hay búsqueda activa, recargar resultados
    if (busqueda.trim()) {
      buscarProductos();
    } else {
      // Agregar el nuevo producto al estado
      setProductos([...productos, nuevoProducto]);
    }
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

  /**
   * Maneja el cambio en el campo de búsqueda
   */
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  /**
   * Limpia la búsqueda
   */
  const limpiarBusqueda = () => {
    setBusqueda('');
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

        {/* Componente de la lista con búsqueda */}
        <div>
          {/* Barra de búsqueda */}
          <div className={styles.busqueda}>
            <input
              type="text"
              placeholder="🔍 Buscar productos por nombre..."
              value={busqueda}
              onChange={handleBusquedaChange}
              className={styles.inputBusqueda}
            />
            {busqueda && (
              <button 
                onClick={limpiarBusqueda}
                className={styles.btnLimpiar}
              >
                ✕
              </button>
            )}
          </div>

          {/* Lista de productos */}
          <ProductoLista
            productos={productos}
            onProductoActualizado={handleProductoActualizado}
            onProductoEliminado={handleProductoEliminado}
            cargando={cargando}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;
