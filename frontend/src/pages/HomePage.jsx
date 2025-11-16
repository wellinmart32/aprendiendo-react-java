import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

/**
 * Página de inicio de la aplicación
 * Muestra un dashboard con acceso a las diferentes secciones
 */
function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.contenedor}>
        <h1 className={styles.titulo}>Bienvenido a Mi Aplicación</h1>
        <p className={styles.subtitulo}>
          Proyecto Full Stack con React + Spring Boot + PostgreSQL
        </p>

        <div className={styles.tarjetas}>
          <Link to="/tareas" className={styles.tarjeta}>
            <div className={styles.icono}>📝</div>
            <h2>Tareas</h2>
            <p>Gestiona tus tareas diarias</p>
          </Link>

          <Link to="/productos" className={styles.tarjeta}>
            <div className={styles.icono}>🛒</div>
            <h2>Productos</h2>
            <p>Administra tu catálogo de productos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
