import React from 'react';
import TareaItem from './TareaItem';
import styles from './TareaLista.module.css';

/**
 * Componente que muestra la lista de todas las tareas
 * @param {Array} tareas - Array con todas las tareas
 * @param {Function} onTareaActualizada - Callback cuando se actualiza una tarea
 * @param {Function} onTareaEliminada - Callback cuando se elimina una tarea
 * @param {boolean} cargando - Indica si se están cargando las tareas
 */
function TareaLista({ tareas, onTareaActualizada, onTareaEliminada, cargando }) {

  // Mostrar mensaje de carga
  if (cargando) {
    return (
      <div className={styles.listaTareas}>
        <h2 className={styles.titulo}>📋 Mis Tareas</h2>
        <p className={styles.mensajeCarga}>Cargando tareas...</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay tareas
  if (!tareas || tareas.length === 0) {
    return (
      <div className={styles.listaTareas}>
        <h2 className={styles.titulo}>📋 Mis Tareas (0)</h2>
        <p className={styles.sinTareas}>No hay tareas. ¡Crea una nueva!</p>
      </div>
    );
  }

  return (
    <div className={styles.listaTareas}>
      <h2 className={styles.titulo}>📋 Mis Tareas ({tareas.length})</h2>
      
      {/* Mapear cada tarea a un componente TareaItem */}
      {tareas.map((tarea) => (
        <TareaItem
          key={tarea.id}
          tarea={tarea}
          onTareaActualizada={onTareaActualizada}
          onTareaEliminada={onTareaEliminada}
        />
      ))}
    </div>
  );
}

export default TareaLista;
