import React, { useState, useEffect } from 'react';
import tareaService from '../services/tareaService';
import TareaFormulario from '../components/tareas/TareaFormulario';
import TareaLista from '../components/tareas/TareaLista';
import styles from './TareasPage.module.css';

/**
 * Página principal de gestión de tareas
 * Orquesta todos los componentes relacionados con tareas
 */
function TareasPage() {
  // Estado para almacenar todas las tareas
  const [tareas, setTareas] = useState([]);
  // Estado para indicar si se están cargando las tareas
  const [cargando, setCargando] = useState(false);

  /**
   * useEffect para cargar las tareas cuando el componente se monta
   */
  useEffect(() => {
    cargarTareas();
  }, []);

  /**
   * Carga todas las tareas desde el backend
   */
  const cargarTareas = async () => {
    try {
      setCargando(true);
      const datos = await tareaService.obtenerTodas();
      setTareas(datos);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      alert('Error al cargar las tareas');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Maneja cuando se crea una nueva tarea
   * @param {Object} nuevaTarea - La tarea recién creada
   */
  const handleTareaCreada = (nuevaTarea) => {
    // Agregar la nueva tarea al estado
    setTareas([...tareas, nuevaTarea]);
  };

  /**
   * Maneja cuando se actualiza una tarea
   * @param {Object} tareaActualizada - La tarea con los datos actualizados
   */
  const handleTareaActualizada = (tareaActualizada) => {
    // Actualizar la tarea en el estado
    setTareas(tareas.map(tarea => 
      tarea.id === tareaActualizada.id ? tareaActualizada : tarea
    ));
  };

  /**
   * Maneja cuando se elimina una tarea
   * @param {number} tareaId - ID de la tarea eliminada
   */
  const handleTareaEliminada = (tareaId) => {
    // Eliminar la tarea del estado
    setTareas(tareas.filter(tarea => tarea.id !== tareaId));
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>📝 Lista de Tareas</h1>
        <p>Proyecto React + Spring Boot + PostgreSQL</p>
      </header>

      <div className={styles.contenedor}>
        {/* Componente del formulario */}
        <TareaFormulario onTareaCreada={handleTareaCreada} />

        {/* Componente de la lista */}
        <TareaLista
          tareas={tareas}
          onTareaActualizada={handleTareaActualizada}
          onTareaEliminada={handleTareaEliminada}
          cargando={cargando}
        />
      </div>
    </div>
  );
}

export default TareasPage;
