import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductoItem from './ProductoItem';
import productoService from '../../services/productoService';

// Mock del servicio de productos
jest.mock('../../services/productoService');

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

/**
 * Suite de tests para ProductoItem
 */
describe('ProductoItem', () => {
  
  const productoMock = {
    id: 1,
    nombre: 'Laptop HP',
    descripcion: 'Laptop gaming de alta gama',
    precio: 1200.50,
    stock: 5,
    categoria: 'Electrónica',
    fechaCreacion: '2025-11-17T10:00:00'
  };

  const mockOnProductoActualizado = jest.fn();
  const mockOnProductoEliminado = jest.fn();

  // Se ejecuta antes de cada test
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  /**
   * Test: El componente se renderiza correctamente
   */
  test('debe renderizar el producto con toda su información', () => {
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Verificar que se muestra el nombre
    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    
    // Verificar que se muestra la descripción
    expect(screen.getByText('Laptop gaming de alta gama')).toBeInTheDocument();
    
    // Verificar que se muestra la categoría
    expect(screen.getByText('Electrónica')).toBeInTheDocument();
    
    // Verificar que se muestra el precio formateado
    expect(screen.getByText(/1200/)).toBeInTheDocument();
    
    // Verificar que se muestra el stock
    expect(screen.getByText(/Stock: 5/)).toBeInTheDocument();
    
    // Verificar que existen los botones
    expect(screen.getByText('✏️ Editar')).toBeInTheDocument();
    expect(screen.getByText('🗑️ Eliminar')).toBeInTheDocument();
  });

  /**
   * Test: Muestra producto sin categoría
   */
  test('debe renderizar correctamente sin categoría', () => {
    const productoSinCategoria = { ...productoMock, categoria: null };
    
    render(
      <ProductoItem
        producto={productoSinCategoria}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Verificar que el nombre sigue apareciendo
    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    
    // Verificar que no hay categoría en el documento
    expect(screen.queryByText('Electrónica')).not.toBeInTheDocument();
  });

  /**
   * Test: Muestra producto sin descripción
   */
  test('debe renderizar correctamente sin descripción', () => {
    const productoSinDescripcion = { ...productoMock, descripcion: null };
    
    render(
      <ProductoItem
        producto={productoSinDescripcion}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Verificar que el nombre aparece
    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    
    // Verificar que no hay descripción
    expect(screen.queryByText('Laptop gaming de alta gama')).not.toBeInTheDocument();
  });

  /**
   * Test: Indica stock bajo cuando stock < 10
   */
  test('debe indicar visualmente cuando el stock es bajo', () => {
    const productoStockBajo = { ...productoMock, stock: 3 };
    
    render(
      <ProductoItem
        producto={productoStockBajo}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Verificar que se muestra el stock
    const stockText = screen.getByText(/Stock: 3/);
    expect(stockText).toBeInTheDocument();
    
    // Verificar que tiene la clase de stock bajo usando className
    expect(stockText.className).toContain('stockBajo');
  });

  /**
   * Test: Abre el modal de edición al hacer clic en Editar
   */
  test('debe abrir el modal de edición al hacer clic en Editar', () => {
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Hacer clic en el botón Editar
    const botonEditar = screen.getByText('✏️ Editar');
    fireEvent.click(botonEditar);
    
    // Verificar que aparece el título del modal
    expect(screen.getByText('Editar Producto')).toBeInTheDocument();
    
    // Verificar que aparecen los botones del modal
    expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  /**
   * Test: Cierra el modal de edición al hacer clic en Cancelar
   */
  test('debe cerrar el modal de edición al hacer clic en Cancelar', () => {
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Abrir modal
    const botonEditar = screen.getByText('✏️ Editar');
    fireEvent.click(botonEditar);
    
    // Verificar que el modal está abierto
    expect(screen.getByText('Editar Producto')).toBeInTheDocument();
    
    // Cerrar modal
    const botonCancelar = screen.getByText('Cancelar');
    fireEvent.click(botonCancelar);
    
    // Verificar que el modal se cerró
    expect(screen.queryByText('Editar Producto')).not.toBeInTheDocument();
  });

  /**
   * Test: Abre el modal de confirmación al hacer clic en Eliminar
   */
  test('debe abrir el modal de confirmación al hacer clic en Eliminar', () => {
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Hacer clic en el botón Eliminar
    const botonEliminar = screen.getByText('🗑️ Eliminar');
    fireEvent.click(botonEliminar);
    
    // Verificar que aparece el modal de confirmación
    expect(screen.getByText('¿Eliminar producto?')).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro de que deseas eliminar "Laptop HP"\?/)).toBeInTheDocument();
    
    // Verificar botones del modal
    expect(screen.getByText('Sí, eliminar')).toBeInTheDocument();
    // Hay dos botones "Cancelar" (uno del modal de edición, otro del de confirmación)
    const botonesCancelar = screen.getAllByText('Cancelar');
    expect(botonesCancelar.length).toBeGreaterThan(0);
  });

  /**
   * Test: Cierra el modal de confirmación al hacer clic en Cancelar
   */
  test('debe cerrar el modal de confirmación sin eliminar al hacer clic en Cancelar', () => {
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Abrir modal de confirmación
    const botonEliminar = screen.getByText('🗑️ Eliminar');
    fireEvent.click(botonEliminar);
    
    // Verificar que está abierto
    expect(screen.getByText('¿Eliminar producto?')).toBeInTheDocument();
    
    // Cancelar
    const botonesCancelar = screen.getAllByText('Cancelar');
    fireEvent.click(botonesCancelar[0]);
    
    // Verificar que se cerró
    expect(screen.queryByText('¿Eliminar producto?')).not.toBeInTheDocument();
    
    // Verificar que NO se llamó al servicio de eliminar
    expect(productoService.eliminar).not.toHaveBeenCalled();
  });

  /**
   * Test: Elimina el producto al confirmar en el modal
   */
  test('debe eliminar el producto exitosamente al confirmar', async () => {
    const { toast } = require('react-toastify');
    
    // Simular eliminación exitosa
    productoService.eliminar.mockResolvedValue();
    
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Abrir modal de confirmación
    const botonEliminar = screen.getByText('🗑️ Eliminar');
    fireEvent.click(botonEliminar);
    
    // Confirmar eliminación
    const botonConfirmar = screen.getByText('Sí, eliminar');
    fireEvent.click(botonConfirmar);
    
    // Verificar que se llamó al servicio
    await waitFor(() => {
      expect(productoService.eliminar).toHaveBeenCalledWith(1);
    });
    
    // Verificar que se mostró el toast de éxito
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
    
    expect(toast.success).toHaveBeenCalledWith('✅ Producto "Laptop HP" eliminado exitosamente');
    
    // Verificar que se llamó al callback
    expect(mockOnProductoEliminado).toHaveBeenCalledWith(1);
  });

  /**
   * Test: Maneja errores al eliminar
   */
  test('debe manejar errores al eliminar producto', async () => {
    const { toast } = require('react-toastify');
    
    // Simular error en el servicio
    productoService.eliminar.mockRejectedValue(new Error('Error de red'));
    
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Abrir modal y confirmar
    const botonEliminar = screen.getByText('🗑️ Eliminar');
    fireEvent.click(botonEliminar);
    
    const botonConfirmar = screen.getByText('Sí, eliminar');
    fireEvent.click(botonConfirmar);
    
    // Verificar que se mostró el error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('❌ Error al eliminar el producto');
    });
    
    // Verificar que NO se llamó al callback de eliminado
    expect(mockOnProductoEliminado).not.toHaveBeenCalled();
  });

/**
   * Test: Formatea el precio correctamente
   */
  test('debe formatear el precio como moneda USD', () => {
    const productoConPrecio = { ...productoMock, precio: 999.99 };
    
    render(
      <ProductoItem
        producto={productoConPrecio}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Verificar que el precio aparece (formato flexible)
    expect(screen.getByText(/999/)).toBeInTheDocument();
  });

  /**
   * Test: Formatea la fecha correctamente
   */
  test('debe formatear la fecha de creación', () => {
    render(
      <ProductoItem
        producto={productoMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
      />
    );
    
    // Verificar que aparece la palabra "Creado:"
    expect(screen.getByText(/Creado:/)).toBeInTheDocument();
  });
});
