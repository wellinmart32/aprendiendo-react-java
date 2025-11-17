import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import TareasPage from './pages/TareasPage';
import ProductosPage from './pages/ProductosPage';

/**
 * Componente principal de la aplicación
 * Configura las rutas y la navegación entre páginas
 */
function App() {
  return (
    <Router>
      {/* Navbar se muestra en todas las páginas */}
      <Navbar />
      
      {/* Definición de rutas */}
      <Routes>
        {/* Ruta principal - Página de inicio */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta de tareas */}
        <Route path="/tareas" element={<TareasPage />} />
        
        {/* Ruta de productos */}
        <Route path="/productos" element={<ProductosPage />} />
      </Routes>

      {/* Contenedor de notificaciones toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
