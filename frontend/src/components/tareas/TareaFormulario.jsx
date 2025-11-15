import React, { useState } from 'react';
import tareaService from '../../services/tareaService';
import styles from './TareaFormulario.module.css';

/**
 * Componente formulario para crear nuevas tareas
 * @param {Function} onTareaCreada - Callback que se ejecuta cuando se crea una tarea
 */
function TareaFormulario({ onTareaCreada }) {
  // Estados para los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    // Validar que el título no esté vacío
    if (!titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      setCargando(true);
      
      // Crear la tarea usando el servicio
      const nuevaTarea = await tareaService.crear({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        completada: false
      });

      // Limpiar el formulario
      setTitulo('');
      setDescripcion('');

      // Notificar al componente padre que se creó una tarea
      if (onTareaCreada) {
        onTareaCreada(nuevaTarea);
      }

    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.formulario}>
      <h2 className={styles.titulo}>➕ Nueva Tarea</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={styles.inputTitulo}
          disabled={cargando}
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={styles.inputDescripcion}
          disabled={cargando}
        />
        <button 
          type="submit" 
          className={styles.btnCrear}
          disabled={cargando}
        >
          {cargando ? 'Creando...' : 'Crear Tarea'}
        </button>
      </form>
    </div>
  );
}

export default TareaFormulario;
