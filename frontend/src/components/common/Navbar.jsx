import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

/**
 * Componente de navegación principal
 * Permite navegar entre las diferentes secciones de la aplicación
 */
function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.contenedor}>
        <div className={styles.logo}>
          <h2>📚 Mi Aplicación</h2>
        </div>
        
        <ul className={styles.menu}>
          <li>
            <Link to="/" className={styles.link}>
              🏠 Inicio
            </Link>
          </li>
          <li>
            <Link to="/tareas" className={styles.link}>
              📝 Tareas
            </Link>
          </li>
          <li>
            <Link to="/productos" className={styles.link}>
              🛒 Productos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
