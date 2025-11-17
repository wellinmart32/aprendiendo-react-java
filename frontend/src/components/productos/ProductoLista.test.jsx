import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductoLista from './ProductoLista';

// Mock de ProductoItem
jest.mock('./ProductoItem', () => {
  return function ProductoItemMock({ producto }) {
    return (
      <div data-testid={`producto-${producto.id}`}>
        {producto.nombre}
      </div>
    );
  };
});

/**
 * Suite de tests para ProductoLista
 */
describe('ProductoLista', () => {
  
  const productosMock = [
    {
      id: 1,
      nombre: 'Laptop HP',
      descripcion: 'Laptop gaming',
      precio: 1200,
      stock: 5,
      categoria: 'Electrónica',
      fechaCreacion: '2025-11-17T10:00:00'
    },
    {
      id: 2,
      nombre: 'Mouse Logitech',
      descripcion: 'Mouse inalámbrico',
      precio: 25,
      stock: 15,
      categoria: 'Electrónica',
      fechaCreacion: '2025-11-17T11:00:00'
    },
    {
      id: 3,
      nombre: 'Teclado Mecánico',
      descripcion: 'Teclado RGB',
      precio: 80,
      stock: 0,
      categoria: 'Electrónica',
      fechaCreacion: '2025-11-17T12:00:00'
    }
  ];

  const mockOnProductoActualizado = jest.fn();
  const mockOnProductoEliminado = jest.fn();

  // Se ejecuta antes de cada test
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  /**
   * Test: Muestra mensaje de cargando
   */
  test('debe mostrar mensaje de cargando cuando cargando es true', () => {
    render(
      <ProductoLista
        productos={[]}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={true}
      />
    );
    
    // Verificar que aparece el mensaje de cargando
    expect(screen.getByText(/Cargando productos/)).toBeInTheDocument();
  });

  /**
   * Test: Muestra mensaje cuando no hay productos
   */
  test('debe mostrar mensaje cuando no hay productos', () => {
    render(
      <ProductoLista
        productos={[]}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Verificar que aparece el mensaje de no hay productos
    expect(screen.getByText(/No hay productos/)).toBeInTheDocument();
  });

  /**
   * Test: Renderiza la lista de productos correctamente
   */
  test('debe renderizar todos los productos cuando hay productos', () => {
    render(
      <ProductoLista
        productos={productosMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Verificar que se renderizan los 3 productos
    expect(screen.getByTestId('producto-1')).toBeInTheDocument();
    expect(screen.getByTestId('producto-2')).toBeInTheDocument();
    expect(screen.getByTestId('producto-3')).toBeInTheDocument();
    
    // Verificar que aparecen los nombres
    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    expect(screen.getByText('Mouse Logitech')).toBeInTheDocument();
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
  });

  /**
   * Test: Renderiza un solo producto
   */
  test('debe renderizar correctamente con un solo producto', () => {
    const unProducto = [productosMock[0]];
    
    render(
      <ProductoLista
        productos={unProducto}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Verificar que se renderiza el producto
    expect(screen.getByTestId('producto-1')).toBeInTheDocument();
    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    
    // Verificar que no hay mensaje de "no hay productos"
    expect(screen.queryByText(/No hay productos/)).not.toBeInTheDocument();
  });

  /**
   * Test: Renderiza múltiples productos (más de 10)
   */
  test('debe renderizar correctamente muchos productos', () => {
    // Crear array de 15 productos
    const muchosProductos = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      nombre: `Producto ${index + 1}`,
      descripcion: `Descripción ${index + 1}`,
      precio: 100 * (index + 1),
      stock: 10,
      categoria: 'Categoría',
      fechaCreacion: '2025-11-17T10:00:00'
    }));
    
    render(
      <ProductoLista
        productos={muchosProductos}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Verificar que se renderizan todos
    expect(screen.getByTestId('producto-1')).toBeInTheDocument();
    expect(screen.getByTestId('producto-15')).toBeInTheDocument();
    
    // Verificar algunos nombres
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 15')).toBeInTheDocument();
  });

  /**
   * Test: No muestra mensaje de cargando cuando no está cargando
   */
  test('no debe mostrar mensaje de cargando cuando cargando es false', () => {
    render(
      <ProductoLista
        productos={productosMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Verificar que NO aparece el mensaje de cargando
    expect(screen.queryByText(/Cargando productos/)).not.toBeInTheDocument();
  });

  /**
   * Test: No muestra mensaje de "no hay productos" cuando hay productos
   */
  test('no debe mostrar mensaje de sin productos cuando hay productos', () => {
    render(
      <ProductoLista
        productos={productosMock}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Verificar que NO aparece el mensaje de sin productos
    expect(screen.queryByText(/No hay productos/)).not.toBeInTheDocument();
  });

  /**
   * Test: Prioriza mensaje de cargando sobre sin productos
   */
  test('debe mostrar cargando aunque no haya productos', () => {
    render(
      <ProductoLista
        productos={[]}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={true}
      />
    );
    
    // Verificar que aparece cargando
    expect(screen.getByText(/Cargando productos/)).toBeInTheDocument();
    
    // Verificar que NO aparece sin productos
    expect(screen.queryByText(/No hay productos/)).not.toBeInTheDocument();
  });

  /**
   * Test: Maneja array de productos undefined
   */
  test('debe manejar correctamente cuando productos es undefined', () => {
    render(
      <ProductoLista
        productos={undefined}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Debería mostrar mensaje de sin productos
    expect(screen.getByText(/No hay productos/)).toBeInTheDocument();
  });

  /**
   * Test: Maneja array de productos null
   */
  test('debe manejar correctamente cuando productos es null', () => {
    render(
      <ProductoLista
        productos={null}
        onProductoActualizado={mockOnProductoActualizado}
        onProductoEliminado={mockOnProductoEliminado}
        cargando={false}
      />
    );
    
    // Debería mostrar mensaje de sin productos
    expect(screen.getByText(/No hay productos/)).toBeInTheDocument();
  });
});
