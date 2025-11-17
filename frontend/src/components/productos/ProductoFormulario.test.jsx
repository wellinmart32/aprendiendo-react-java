import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductoFormulario from './ProductoFormulario';
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
 * Suite de tests para ProductoFormulario
 */
describe('ProductoFormulario', () => {
  
  // Se ejecuta antes de cada test
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  /**
   * Test: El componente se renderiza correctamente
   */
  test('debe renderizar el formulario con todos los campos', () => {
    render(<ProductoFormulario onProductoCreado={() => {}} />);
    
    // Verificar que el título esté presente
    expect(screen.getByText('➕ Nuevo Producto')).toBeInTheDocument();
    
    // Verificar que los inputs estén presentes
    expect(screen.getByPlaceholderText('Nombre del producto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descripción (opcional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Precio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Stock')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Categoría (opcional)')).toBeInTheDocument();
    
    // Verificar que el botón esté presente
    expect(screen.getByText('Crear Producto')).toBeInTheDocument();
  });

  /**
   * Test: Permite escribir en todos los campos
   */
  test('debe permitir escribir en todos los inputs', () => {
    render(<ProductoFormulario onProductoCreado={() => {}} />);
    
    const inputNombre = screen.getByPlaceholderText('Nombre del producto');
    const inputDescripcion = screen.getByPlaceholderText('Descripción (opcional)');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    const inputStock = screen.getByPlaceholderText('Stock');
    const inputCategoria = screen.getByPlaceholderText('Categoría (opcional)');
    
    // Simular escritura en cada campo
    fireEvent.change(inputNombre, { target: { value: 'Laptop HP' } });
    fireEvent.change(inputDescripcion, { target: { value: 'Laptop gaming' } });
    fireEvent.change(inputPrecio, { target: { value: '1200' } });
    fireEvent.change(inputStock, { target: { value: '5' } });
    fireEvent.change(inputCategoria, { target: { value: 'Electrónica' } });
    
    // Verificar que los valores cambiaron
    expect(inputNombre.value).toBe('Laptop HP');
    expect(inputDescripcion.value).toBe('Laptop gaming');
    expect(inputPrecio.value).toBe('1200');
    expect(inputStock.value).toBe('5');
    expect(inputCategoria.value).toBe('Electrónica');
  });

  /**
   * Test: Muestra error si el nombre está vacío
   */
  test('debe mostrar error si el nombre está vacío', async () => {
    const { toast } = require('react-toastify');
    render(<ProductoFormulario onProductoCreado={() => {}} />);
    
    const botonCrear = screen.getByText('Crear Producto');
    
    // Intentar enviar sin nombre
    fireEvent.click(botonCrear);
    
    // Verificar que se llamó toast.error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('❌ El nombre es obligatorio');
    });
    
    // Verificar que NO se llamó al servicio (fuera del waitFor)
    expect(productoService.crear).not.toHaveBeenCalled();
  });

  /**
   * Test: Muestra error si el precio es 0 o negativo
   */
  test('debe mostrar error si el precio es inválido', async () => {
    const { toast } = require('react-toastify');
    render(<ProductoFormulario onProductoCreado={() => {}} />);
    
    const inputNombre = screen.getByPlaceholderText('Nombre del producto');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    const botonCrear = screen.getByText('Crear Producto');
    
    // Llenar con precio 0
    fireEvent.change(inputNombre, { target: { value: 'Producto' } });
    fireEvent.change(inputPrecio, { target: { value: '0' } });
    
    fireEvent.click(botonCrear);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('❌ El precio debe ser mayor a 0');
    });
  });

  /**
   * Test: Muestra error si el stock es negativo
   */
  test('debe mostrar error si el stock es negativo', async () => {
    const { toast } = require('react-toastify');
    render(<ProductoFormulario onProductoCreado={() => {}} />);
    
    const inputNombre = screen.getByPlaceholderText('Nombre del producto');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    const inputStock = screen.getByPlaceholderText('Stock');
    const botonCrear = screen.getByText('Crear Producto');
    
    // Llenar con stock negativo
    fireEvent.change(inputNombre, { target: { value: 'Producto' } });
    fireEvent.change(inputPrecio, { target: { value: '100' } });
    fireEvent.change(inputStock, { target: { value: '-5' } });
    
    fireEvent.click(botonCrear);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('❌ El stock no puede ser negativo');
    });
  });

  /**
   * Test: Crea un producto exitosamente
   */
  test('debe crear un producto exitosamente', async () => {
    const { toast } = require('react-toastify');
    const mockOnProductoCreado = jest.fn();
    const productoCreado = {
      id: 1,
      nombre: 'Laptop HP',
      descripcion: 'Laptop gaming',
      precio: 1200,
      stock: 5,
      categoria: 'Electrónica'
    };
    
    // Simular respuesta exitosa del servicio
    productoService.crear.mockResolvedValue(productoCreado);
    
    render(<ProductoFormulario onProductoCreado={mockOnProductoCreado} />);
    
    // Llenar el formulario
    const inputNombre = screen.getByPlaceholderText('Nombre del producto');
    const inputDescripcion = screen.getByPlaceholderText('Descripción (opcional)');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    const inputStock = screen.getByPlaceholderText('Stock');
    const inputCategoria = screen.getByPlaceholderText('Categoría (opcional)');
    
    fireEvent.change(inputNombre, { target: { value: 'Laptop HP' } });
    fireEvent.change(inputDescripcion, { target: { value: 'Laptop gaming' } });
    fireEvent.change(inputPrecio, { target: { value: '1200' } });
    fireEvent.change(inputStock, { target: { value: '5' } });
    fireEvent.change(inputCategoria, { target: { value: 'Electrónica' } });
    
    // Enviar formulario
    const botonCrear = screen.getByText('Crear Producto');
    fireEvent.click(botonCrear);
    
    // Verificar que se llamó al servicio (en un waitFor separado)
    await waitFor(() => {
      expect(productoService.crear).toHaveBeenCalled();
    });
    
    // Verificar los argumentos de la llamada
    expect(productoService.crear).toHaveBeenCalledWith({
      nombre: 'Laptop HP',
      descripcion: 'Laptop gaming',
      precio: 1200,
      stock: 5,
      categoria: 'Electrónica'
    });
    
    // Verificar que se llamó toast.success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
    
    expect(toast.success).toHaveBeenCalledWith('✅ Producto "Laptop HP" creado exitosamente');
    
    // Verificar que se llamó al callback
    expect(mockOnProductoCreado).toHaveBeenCalledWith(productoCreado);
    
    // Verificar que los campos se limpiaron
    expect(inputNombre.value).toBe('');
    expect(inputDescripcion.value).toBe('');
    expect(inputPrecio.value).toBe('');
    expect(inputStock.value).toBe('');
    expect(inputCategoria.value).toBe('');
  });

  /**
   * Test: Maneja errores al crear producto
   */
  test('debe manejar errores al crear producto', async () => {
    const { toast } = require('react-toastify');
    
    // Simular error en el servicio
    productoService.crear.mockRejectedValue(new Error('Error de red'));
    
    render(<ProductoFormulario onProductoCreado={() => {}} />);
    
    // Llenar el formulario
    const inputNombre = screen.getByPlaceholderText('Nombre del producto');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    const inputStock = screen.getByPlaceholderText('Stock');
    
    fireEvent.change(inputNombre, { target: { value: 'Producto' } });
    fireEvent.change(inputPrecio, { target: { value: '100' } });
    fireEvent.change(inputStock, { target: { value: '10' } });
    
    // Enviar formulario
    const botonCrear = screen.getByText('Crear Producto');
    fireEvent.click(botonCrear);
    
    // Verificar que se mostró el error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('❌ Error al crear el producto. Intenta nuevamente.');
    });
  });

  /**
   * Test: Deshabilita campos mientras está cargando
   */
  test('debe deshabilitar campos y botón mientras está cargando', async () => {
    // Simular una promesa que nunca se resuelve
    productoService.crear.mockImplementation(() => new Promise(() => {}));
    
    render(<ProductoFormulario onProductoCreado={() => {}} />);
    
    // Llenar el formulario
    const inputNombre = screen.getByPlaceholderText('Nombre del producto');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    const inputStock = screen.getByPlaceholderText('Stock');
    
    fireEvent.change(inputNombre, { target: { value: 'Producto' } });
    fireEvent.change(inputPrecio, { target: { value: '100' } });
    fireEvent.change(inputStock, { target: { value: '10' } });
    
    // Enviar formulario
    const botonCrear = screen.getByText('Crear Producto');
    fireEvent.click(botonCrear);
    
    // Verificar estado de carga (un expect por waitFor)
    await waitFor(() => {
      expect(screen.getByText('Creando...')).toBeInTheDocument();
    });
    
    // Verificar que está deshabilitado (fuera del waitFor)
    expect(screen.getByText('Creando...')).toBeDisabled();
    expect(inputNombre).toBeDisabled();
  });
});
