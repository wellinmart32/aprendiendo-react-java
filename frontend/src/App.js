import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  // Estado para almacenar el mensaje del backend
  const [mensaje, setMensaje] = useState('Cargando...');

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    // Función para llamar al backend
    const obtenerMensaje = async () => {
      try {
        // Llamada HTTP GET al endpoint del backend
        const respuesta = await fetch('http://localhost:8080/api/hola');
        // Convertir la respuesta a texto
        const texto = await respuesta.text();
        // Actualizar el estado con el mensaje recibido
        setMensaje(texto);
      } catch (error) {
        // Si hay error, mostrar mensaje de error
        console.error('Error al conectar con el backend:', error);
        setMensaje('Error al conectar con el backend');
      }
    };

    // Ejecutar la función
    obtenerMensaje();
  }, []); // [] significa que solo se ejecuta una vez al montar el componente

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Primera Aplicación React + Spring Boot</h1>
        <p>{mensaje}</p>
      </header>
    </div>
  );
}

export default App;