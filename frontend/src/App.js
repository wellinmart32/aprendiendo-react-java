import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  // Estados para manejar las tareas y el formulario
  const [tareas, setTareas] = useState([]); // Lista de todas las tareas
  const [titulo, setTitulo] = useState(''); // Título de la nueva tarea
  const [descripcion, setDescripcion] = useState(''); // Descripción de la nueva tarea
  const [editando, setEditando] = useState(null); // ID de la tarea que se está editando
  const [cargando, setCargando] = useState(false); // Indicador de carga

  // URL base de la API
  const API_URL = 'http://localhost:8080/api/tareas';

  /**
   * useEffect para cargar las tareas cuando el componente se monta
   */
  useEffect(() => {
    cargarTareas();
  }, []);

  /**
   * Función para obtener todas las tareas del backend
   */
  const cargarTareas = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      setTareas(datos);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      alert('Error al cargar las tareas');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Función para crear una nueva tarea
   */
  const crearTarea = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    // Validar que el título no esté vacío
    if (!titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo,
          descripcion: descripcion,
          completada: false
        })
      });

      if (respuesta.ok) {
        // Limpiar el formulario
        setTitulo('');
        setDescripcion('');
        // Recargar la lista de tareas
        cargarTareas();
      } else {
        alert('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea');
    }
  };

  /**
   * Función para marcar/desmarcar una tarea como completada
   */
  const toggleCompletada = async (id, completada) => {
    try {
      const endpoint = completada 
        ? `${API_URL}/${id}/descompletar` 
        : `${API_URL}/${id}/completar`;

      const respuesta = await fetch(endpoint, {
        method: 'PATCH'
      });

      if (respuesta.ok) {
        // Recargar la lista de tareas
        cargarTareas();
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea');
    }
  };

  /**
   * Función para eliminar una tarea
   */
  const eliminarTarea = async (id) => {
    // Confirmar antes de eliminar
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (respuesta.ok || respuesta.status === 204) {
        // Recargar la lista de tareas
        cargarTareas();
      } else {
        alert('Error al eliminar la tarea');
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Lista de Tareas</h1>
        <p>Proyecto React + Spring Boot + PostgreSQL</p>
      </header>

      <div className="contenedor">
        {/* Formulario para crear nueva tarea */}
        <div className="formulario">
          <h2>➕ Nueva Tarea</h2>
          <form onSubmit={crearTarea}>
            <input
              type="text"
              placeholder="Título de la tarea"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-titulo"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input-descripcion"
            />
            <button type="submit" className="btn-crear">
              Crear Tarea
            </button>
          </form>
        </div>

        {/* Lista de tareas */}
        <div className="lista-tareas">
          <h2>📋 Mis Tareas ({tareas.length})</h2>
          
          {cargando ? (
            <p>Cargando tareas...</p>
          ) : tareas.length === 0 ? (
            <p className="sin-tareas">No hay tareas. ¡Crea una nueva!</p>
          ) : (
            tareas.map((tarea) => (
              <div 
                key={tarea.id} 
                className={`tarea ${tarea.completada ? 'completada' : ''}`}
              >
                <div className="tarea-contenido">
                  <h3>{tarea.titulo}</h3>
                  {tarea.descripcion && <p>{tarea.descripcion}</p>}
                  <small>
                    Creada: {new Date(tarea.fechaCreacion).toLocaleString()}
                  </small>
                </div>
                <div className="tarea-acciones">
                  <button
                    onClick={() => toggleCompletada(tarea.id, tarea.completada)}
                    className={`btn ${tarea.completada ? 'btn-descompletar' : 'btn-completar'}`}
                  >
                    {tarea.completada ? '↩️ Descompletar' : '✅ Completar'}
                  </button>
                  <button
                    onClick={() => eliminarTarea(tarea.id)}
                    className="btn btn-eliminar"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
