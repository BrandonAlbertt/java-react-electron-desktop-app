/*
  useBiblioteca.js - Hook para cargar y gestionar la biblioteca del usuario
  
  QUE HACE:
  Obtiene del servidor: usuario + listas de reproduccion + canciones
  
  COMO SE USA:
  const { usuario, listas, loading, error } = useBiblioteca(1);
  
  QUE RETORNA:
  - usuario: datos del usuario (id, nombre, avatar)
  - listas: playlists del usuario con sus canciones
  - loading: true mientras carga, false cuando termina
  - error: null si todo bien, o mensaje de error
*/

import { useCallback, useEffect, useState } from "react";
import { obtenerBibliotecaUsuario } from "../api/bibliotecaUsuarioApi";

export function useBiblioteca(usuarioId) {
    // Variables que guardan informacion
    const [usuario, setUsuario] = useState(null);      // Datos del usuario
    const [listas, setListas] = useState([]);          // Listas del usuario
    const [loading, setLoading] = useState(true);      // Esta cargando?
    const [error, setError] = useState(null);          // Hay error?

    // ===============================
    // CARGAR BIBLIOTECA
    // ===============================
    // recarga usuario y listas para mantener Home como fuente principal de datos
    const recargarBiblioteca = useCallback(async () => {
        // Validar que hay un usuario ID valido
        if (!usuarioId) {
            setLoading(false);
            setError("Usuario no valido");
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            // Obtener datos del servidor via obtenerBibliotecaUsuario
            const data = await obtenerBibliotecaUsuario(usuarioId);

            // Mostrar en consola del navegador (F12) para rastrear datos
            console.log("[useBiblioteca] respuesta completa:", data);
            console.log("[useBiblioteca] usuario:", data.usuario);
            console.log("[useBiblioteca] listas:", data.listas);

            // Extraer todas las canciones en un solo array
            const canciones = (data.listas ?? []).flatMap((lista) => lista.canciones ?? []);
            console.log("[useBiblioteca] canciones:", canciones);

            // Guardar datos en el estado
            setUsuario(data.usuario);
            setListas(data.listas ?? []);
            return data;
        } catch (err) {
            // Si hay error, mostrarlo
            console.error("[useBiblioteca] error cargando biblioteca:", err);
            setError("Error cargando biblioteca");
            return null;
        } finally {
            // Siempre dejar de cargar (haya error o no)
            setLoading(false);
        }
    }, [usuarioId]);

    // Se ejecuta cuando el componente carga o cuando usuarioId cambia
    useEffect(() => {
        // Ejecutar la funcion cargar fuera del cuerpo sincrono del efecto
        const timerId = setTimeout(() => {
            recargarBiblioteca();
        }, 0);

        return () => clearTimeout(timerId);
    }, [recargarBiblioteca]); // Ejecutar cuando usuarioId cambie

    // Retornar datos y estados para usar en componentes
    return { usuario, listas, loading, error, recargarBiblioteca, setListas };
}

/*
  COMO USAR EN COMPONENTES:
  
  Archivo: Home.jsx (componente padre que carga los datos)
  ─────────────────────────────────────────────────────────
  import { useBiblioteca } from "../hooks/useBiblioteca";
  import Header from "./Header";
  import BodyListas from "./BodyListas";
  
  export default function Home() {
      // Obtener datos con el hook
      const { usuario, listas, loading, error } = useBiblioteca(1);
      
      if (loading) return <p>Cargando...</p>;
      if (error) return <p>Error: {error}</p>;
      
      // Pasar USUARIO al Header
      // Pasar LISTAS al Body
      return (
          <div>
              <Header usuario={usuario} />
              <BodyListas listas={listas} />
          </div>
      );
  }
  
  Archivo: Header.jsx (componente que recibe usuario)
  ──────────────────────────────────────────────────
  export default function Header({ usuario }) {
      return (
          <header>
              <h1>{usuario?.nombre_usuario}</h1>
              <img src={usuario?.avatar} alt="Avatar" />
          </header>
      );
  }
  
  Archivo: BodyListas.jsx (componente que recibe listas)
  ────────────────────────────────────────────────────
  export default function BodyListas({ listas }) {
      return (
          <div>
              {listas.map(lista => (
                  <div key={lista.id}>
                      <h2>{lista.nombre}</h2>
                      <p>{lista.canciones.length} canciones</p>
                  </div>
              ))}
          </div>
      );
  }
  
  RESUMEN:
  1. useBiblioteca() se llama EN EL COMPONENTE PADRE (Home)
  2. El padre obtiene { usuario, listas, loading, error }
  3. El padre pasa usuario al Header como <Header usuario={usuario} />
  4. El padre pasa listas al Body como <BodyListas listas={listas} />
  5. Los componentes hijos reciben y usan esos datos
*/
