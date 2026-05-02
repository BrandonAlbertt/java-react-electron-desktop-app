import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Son componentes (ventanas) home y welcome (login/registro)
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";

// N: Componente raíz de la aplicación
// N: Controla el estado de autenticación y muestra Welcome o Home.
// N: Usa localStorage para persistir sesión entre recargas.
// N: Aplica animaciones suaves al cambiar entre vistas con Framer Motion.
function App() {

  // =============================
  // ESTADOS PRINCIPALES
  // =============================
  const [isLogged, setIsLogged] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // =============================
  // FUNCIONES Y EVENTOS AGRUPADOS
  // =============================
  // Al cargar la app, revisar si hay token y usuario guardados en localStorage
  useEffect(() => {
    // Obtener token del localStorage, si existe
    const token = localStorage.getItem("token");
    //recupera el usuario guardado en localStorage, si existe
    const usuarioGuardado = localStorage.getItem("usuario");

    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      setIsLogged(true);
    }
  }, []);

  // Manejar login y guardar en localStorage
  const handleLogin = ({ token, usuario }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);
    setIsLogged(true);
  };

  // Manejar logout y limpiar localStorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setIsLogged(false);
  };


  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050507] text-white">
      <AnimatePresence mode="wait">
        {!isLogged ? (
          <motion.div
            key="welcome"
            className="h-full w-full"
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <Welcome onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            className="h-full w-full"
            initial={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <Home usuario={usuario} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;