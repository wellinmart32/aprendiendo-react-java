import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import productoService from '../../services/productoService';
import styles from './ProductoFormulario.module.css';

/**
 * Componente formulario para editar productos existentes
 * @param {Object} producto - Producto a editar
 * @param {Function} onProductoActualizado - Callback que se ejecuta cuando se actualiza un producto
 * @param {Function} onCancelar - Callback para cancelar la edición
 */
function ProductoFormularioEditar({ producto, onProductoActualizado, onCancelar }) {
  // Estados para los campos del formulario (inicializados con los valores del producto)
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion || '');
  const [precio, setPrecio] = useState(producto.precio.toString());
  const [stock, setStock] = useState(producto.stock.toString());
  const [categoria, setCategoria] = useState(producto.categoria || '');
  const [cargando, setCargando] = useState(false);

  /**
   * useEffect para actualizar los campos si cambia el producto
   */
  useEffect(() => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || '');
    setPrecio(producto.precio.toString());
    setStock(producto.stock.toString());
    setCategoria(producto.categoria || '');
  }, [producto]);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    // Validar que los campos obligatorios no estén vacíos
    if (!nombre.trim()) {
      toast.error('❌ El nombre es obligatorio');
      return;
    }

    if (!precio || parseFloat(precio) <= 0) {
      toast.error('❌ El precio debe ser mayor a 0');
      return;
    }

    if (!stock || parseInt(stock) < 0) {
      toast.error('❌ El stock no puede ser negativo');
      return;
    }

    try {
      setCargando(true);
      
      // Actualizar el producto usando el servicio
      const productoActualizado = await productoService.actualizar(producto.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria: categoria.trim()
      });

      // Notificación de éxito
      toast.success(`✅ Producto "${productoActualizado.nombre}" actualizado exitosamente`);

      // Notificar al componente padre que se actualizó el producto
      if (onProductoActualizado) {
        onProductoActualizado(productoActualizado);
      }

    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('❌ Error al actualizar el producto. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={styles.input}
        disabled={cargando}
      />
      
      <textarea
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className={styles.textarea}
        disabled={cargando}
      />
      
      <input
        type="number"
        step="0.01"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className={styles.input}
        disabled={cargando}
      />
      
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className={styles.input}
        disabled={cargando}
      />
      
      <input
        type="text"
        placeholder="Categoría (opcional)"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className={styles.input}
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

export default ProductoFormularioEditar;
