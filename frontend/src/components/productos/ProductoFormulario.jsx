import React, { useState } from 'react';
import { toast } from 'react-toastify';
import productoService from '../../services/productoService';
import styles from './ProductoFormulario.module.css';

/**
 * Componente formulario para crear nuevos productos
 * @param {Function} onProductoCreado - Callback que se ejecuta cuando se crea un producto
 */
function ProductoFormulario({ onProductoCreado }) {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cargando, setCargando] = useState(false);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    // Validar que el nombre no esté vacío
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
      
      // Crear el producto usando el servicio
      const nuevoProducto = await productoService.crear({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria: categoria.trim()
      });

      // Limpiar el formulario
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      setCategoria('');

      // Notificación de éxito
      toast.success(`✅ Producto "${nuevoProducto.nombre}" creado exitosamente`);

      // Notificar al componente padre que se creó un producto
      if (onProductoCreado) {
        onProductoCreado(nuevoProducto);
      }

    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error('❌ Error al crear el producto. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.formulario}>
      <h2 className={styles.titulo}>➕ Nuevo Producto</h2>
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
        
        <button 
          type="submit" 
          className={styles.btnCrear}
          disabled={cargando}
        >
          {cargando ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
}

export default ProductoFormulario;
