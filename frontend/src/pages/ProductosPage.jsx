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
  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [soloConStock, setSoloConStock] = useState(false);
  // Estado para indicar si se están cargando los productos
  const [cargando, setCargando] = useState(false);
  // Estado para almacenar categorías únicas
  const [categorias, setCategorias] = useState([]);

  /**
   * Carga todos los productos desde el backend
   */
  const cargarProductos = useCallback(async () => {
    try {
      setCargando(true);
      const datos = await productoService.obtenerTodos();
      setProductos(datos);
      
      // Extraer categorías únicas
      const categoriasUnicas = [...new Set(datos
        .map(p => p.categoria)
        .filter(c => c && c.trim() !== ''))
      ];
      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar los productos');
    } finally {
      setCargando(false);
    }
  }, []);

  /**
   * Filtra productos según los criterios seleccionados
   */
  const filtrarProductos = useCallback(async () => {
    try {
      setCargando(true);
      let datos;

      // Prioridad de filtros
      if (categoriaFiltro) {
        // Filtrar por categoría
        datos = await productoService.obtenerPorCategoria(categoriaFiltro);
      } else if (busqueda.trim()) {
        // Filtrar por búsqueda
        datos = await productoService.buscarPorNombre(busqueda.trim());
      } else {
        // Cargar todos
        datos = await productoService.obtenerTodos();
      }

      // Filtrar por stock si está activado
      if (soloConStock) {
        datos = datos.filter(p => p.stock > 0);
      }

      setProductos(datos);
    } catch (error) {
      console.error('Error al filtrar productos:', error);
      alert('Error al filtrar productos');
    } finally {
      setCargando(false);
    }
  }, [busqueda, categoriaFiltro, soloConStock]);

  /**
   * useEffect para cargar los productos cuando el componente se monta
   */
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  /**
   * useEffect para filtrar cuando cambian los criterios
   */
  useEffect(() => {
    filtrarProductos();
  }, [filtrarProductos]);

  /**
   * Maneja cuando se crea un nuevo producto
   * @param {Object} nuevoProducto - El producto recién creado
   */
  const handleProductoCreado = (nuevoProducto) => {
    filtrarProductos();
  };

/**
   * Maneja cuando se actualiza un producto
   * @param {Object} productoActualizado - El producto con los datos actualizados
   */
  const handleProductoActualizado = (productoActualizado) => {
    // Recargar productos y categorías para reflejar cambios
    if (busqueda.trim() || categoriaFiltro || soloConStock) {
      filtrarProductos();
    } else {
      cargarProductos();
    }
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
    setCategoriaFiltro(''); // Limpiar filtro de categoría
  };

  /**
   * Maneja el cambio en el filtro de categoría
   */
  const handleCategoriaChange = (e) => {
    setCategoriaFiltro(e.target.value);
    setBusqueda(''); // Limpiar búsqueda
  };

  /**
   * Maneja el cambio en el checkbox de stock
   */
  const handleStockChange = (e) => {
    setSoloConStock(e.target.checked);
  };

  /**
   * Limpia todos los filtros
   */
  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaFiltro('');
    setSoloConStock(false);
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

        {/* Componente de la lista con filtros */}
        <div>
          {/* Panel de filtros */}
          <div className={styles.filtros}>
            {/* Búsqueda por nombre */}
            <div className={styles.filtroItem}>
              <input
                type="text"
                placeholder="🔍 Buscar por nombre..."
                value={busqueda}
                onChange={handleBusquedaChange}
                className={styles.inputBusqueda}
              />
            </div>

            {/* Filtro por categoría */}
            <div className={styles.filtroItem}>
              <select
                value={categoriaFiltro}
                onChange={handleCategoriaChange}
                className={styles.selectCategoria}
              >
                <option value="">📂 Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por stock */}
            <div className={styles.filtroItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={soloConStock}
                  onChange={handleStockChange}
                  className={styles.checkbox}
                />
                <span>✅ Solo con stock</span>
              </label>
            </div>

            {/* Botón limpiar filtros */}
            {(busqueda || categoriaFiltro || soloConStock) && (
              <button 
                onClick={limpiarFiltros}
                className={styles.btnLimpiarFiltros}
              >
                ✕ Limpiar filtros
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
