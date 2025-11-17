import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
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
  // Estado para ordenamiento
  const [ordenamiento, setOrdenamiento] = useState('');
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(10);
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
      
      // Reiniciar a la primera página
      setPaginaActual(1);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('❌ Error al cargar los productos');
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
      
      // Reiniciar a la primera página cuando cambian los filtros
      setPaginaActual(1);
    } catch (error) {
      console.error('Error al filtrar productos:', error);
      toast.error('❌ Error al filtrar productos');
    } finally {
      setCargando(false);
    }
  }, [busqueda, categoriaFiltro, soloConStock]);

  /**
   * Ordena los productos según el criterio seleccionado
   */
  const ordenarProductos = useCallback((productosParaOrdenar) => {
    if (!ordenamiento) return productosParaOrdenar;

    const productosOrdenados = [...productosParaOrdenar];

    switch (ordenamiento) {
      case 'nombre-asc':
        return productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'nombre-desc':
        return productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'precio-asc':
        return productosOrdenados.sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return productosOrdenados.sort((a, b) => b.precio - a.precio);
      case 'stock-asc':
        return productosOrdenados.sort((a, b) => a.stock - b.stock);
      case 'stock-desc':
        return productosOrdenados.sort((a, b) => b.stock - a.stock);
      case 'fecha-asc':
        return productosOrdenados.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
      case 'fecha-desc':
        return productosOrdenados.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
      default:
        return productosOrdenados;
    }
  }, [ordenamiento]);

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
    const nuevosProductos = productos.filter(producto => producto.id !== productoId);
    setProductos(nuevosProductos);
    
    // Ajustar página si quedó vacía
    const totalPaginas = Math.ceil(nuevosProductos.length / productosPorPagina);
    if (paginaActual > totalPaginas && totalPaginas > 0) {
      setPaginaActual(totalPaginas);
    }
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
   * Maneja el cambio en el ordenamiento
   */
  const handleOrdenamientoChange = (e) => {
    setOrdenamiento(e.target.value);
  };

  /**
   * Maneja el cambio en productos por página
   */
  const handleProductosPorPaginaChange = (e) => {
    setProductosPorPagina(Number(e.target.value));
    setPaginaActual(1); // Reiniciar a primera página
  };

  /**
   * Limpia todos los filtros y ordenamiento
   */
  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaFiltro('');
    setSoloConStock(false);
    setOrdenamiento('');
    setPaginaActual(1);
  };

  // Aplicar ordenamiento a los productos
  const productosOrdenados = ordenarProductos(productos);

  // Calcular paginación
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosPaginados = productosOrdenados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

  /**
   * Navega a la página anterior
   */
  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  /**
   * Navega a la página siguiente
   */
  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  /**
   * Va a una página específica
   */
  const irAPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
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

            {/* Ordenamiento */}
            <div className={styles.filtroItem}>
              <select
                value={ordenamiento}
                onChange={handleOrdenamientoChange}
                className={styles.selectOrdenamiento}
              >
                <option value="">🔄 Ordenar por...</option>
                <option value="nombre-asc">Nombre (A-Z)</option>
                <option value="nombre-desc">Nombre (Z-A)</option>
                <option value="precio-asc">Precio (Menor a Mayor)</option>
                <option value="precio-desc">Precio (Mayor a Menor)</option>
                <option value="stock-asc">Stock (Menor a Mayor)</option>
                <option value="stock-desc">Stock (Mayor a Menor)</option>
                <option value="fecha-desc">Más recientes</option>
                <option value="fecha-asc">Más antiguos</option>
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
            {(busqueda || categoriaFiltro || soloConStock || ordenamiento) && (
              <button 
                onClick={limpiarFiltros}
                className={styles.btnLimpiarFiltros}
              >
                ✕ Limpiar todo
              </button>
            )}
          </div>

          {/* Controles de paginación superior */}
          {productosOrdenados.length > 0 && (
            <div className={styles.paginacionInfo}>
              <span className={styles.textoInfo}>
                Mostrando {indicePrimero + 1}-{Math.min(indiceUltimo, productosOrdenados.length)} de {productosOrdenados.length} productos
              </span>
              <select
                value={productosPorPagina}
                onChange={handleProductosPorPaginaChange}
                className={styles.selectPorPagina}
              >
                <option value="5">5 por página</option>
                <option value="10">10 por página</option>
                <option value="20">20 por página</option>
                <option value="50">50 por página</option>
              </select>
            </div>
          )}

          {/* Lista de productos */}
          <ProductoLista
            productos={productosPaginados}
            onProductoActualizado={handleProductoActualizado}
            onProductoEliminado={handleProductoEliminado}
            cargando={cargando}
          />

          {/* Controles de paginación inferior */}
          {totalPaginas > 1 && (
            <div className={styles.paginacion}>
              <button
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
                className={styles.btnPaginacion}
              >
                ← Anterior
              </button>

              <div className={styles.numeroPaginas}>
                {[...Array(totalPaginas)].map((_, index) => {
                  const numeroPagina = index + 1;
                  // Mostrar solo algunas páginas alrededor de la actual
                  if (
                    numeroPagina === 1 ||
                    numeroPagina === totalPaginas ||
                    (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1)
                  ) {
                    return (
                      <button
                        key={numeroPagina}
                        onClick={() => irAPagina(numeroPagina)}
                        className={`${styles.btnNumeroPagina} ${
                          paginaActual === numeroPagina ? styles.paginaActiva : ''
                        }`}
                      >
                        {numeroPagina}
                      </button>
                    );
                  } else if (
                    numeroPagina === paginaActual - 2 ||
                    numeroPagina === paginaActual + 2
                  ) {
                    return <span key={numeroPagina} className={styles.puntosSuspensivos}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={paginaSiguiente}
                disabled={paginaActual === totalPaginas}
                className={styles.btnPaginacion}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;
