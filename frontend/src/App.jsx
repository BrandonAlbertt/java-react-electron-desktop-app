import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { obtenerUsuarioPorId } from "./api/usuarioApi";

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
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setIsLogged(false);
  };

  const parseTokenPayload = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return null;

      // JWT usa base64url, lo convertimos a base64 estándar para decodificarlo.
      const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  };

  const parseUsuarioGuardado = (rawUsuario) => {
    if (!rawUsuario || rawUsuario === "undefined" || rawUsuario === "null") {
      return null;
    }

    try {
      return JSON.parse(rawUsuario);
    } catch {
      return null;
    }
  };

  // =============================
  // FUNCIONES Y EVENTOS AGRUPADOS
  // =============================
  // Al cargar la app, revisar si hay token y usuario guardados en localStorage
  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) {
          setIsLogged(false);
          setUsuario(null);
          setIsBootstrapping(false);
        }
        return;
      }

      const payload = parseTokenPayload(token);

      // Si exp está presente y ya venció, limpiamos para volver a Welcome.
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        if (isMounted) {
          clearSession();
          setIsBootstrapping(false);
        }
        return;
      }

      const usuarioGuardado = parseUsuarioGuardado(localStorage.getItem("usuario"));

      if (usuarioGuardado) {
        if (isMounted) {
          setUsuario(usuarioGuardado);
          setIsLogged(true);
          setIsBootstrapping(false);
        }
        return;
      }

      if (!payload?.id) {
        if (isMounted) {
          clearSession();
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const usuarioApi = await obtenerUsuarioPorId(payload.id);

        if (isMounted && usuarioApi) {
          localStorage.setItem("usuario", JSON.stringify(usuarioApi));
          setUsuario(usuarioApi);
          setIsLogged(true);
        }
      } catch {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
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
    clearSession();
  };

  if (isBootstrapping) {
    return <div className="h-screen w-screen bg-[#050507]" />;
  }


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