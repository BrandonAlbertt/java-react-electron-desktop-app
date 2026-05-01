/*
  useExplorar.js - Hook para obtener generos, grupos y canciones del servidor
  
  QUE HACE:
  Obtiene del servidor: generos + grupos + canciones para la seccion explorar
  
  COMO SE USA:
  const { data, loading, error } = useExplorar();
  // Despues acceder a: data.generos, data.grupos, data.canciones
  
  QUE RETORNA:
  - data: objeto con { generos: [], grupos: [], canciones: [] }
  - loading: true mientras carga, false cuando termina
  - error: null si todo bien, o mensaje de error
*/

import { useEffect, useState } from "react";
import { obtenerExplorar } from "../api/explorarApi";

export function useExplorar() {
    // Variable que guarda los datos en estructura
    const [data, setData] = useState({
        generos: [],      // Lista de generos musicales
        grupos: [],       // Lista de grupos/artistas
        canciones: [],    // Lista de canciones
    });

    const [loading, setLoading] = useState(true);      // Esta cargando?
    const [error, setError] = useState(null);          // Hay error?

    // Se ejecuta cuando el componente carga (array vacio [] = solo una vez)
    useEffect(() => {
        // Funcion para cargar datos
        async function cargarDatos() {
            try {
                setLoading(true);
                // Obtener datos del servidor
                const resultado = await obtenerExplorar();
                setData(resultado);
            } catch (error) {
                // Si hay error
                console.error("Error cargando explorar:", error);
                setError("No se pudo cargar la informacion");
            } finally {
                // Siempre dejar de cargar
                setLoading(false);
            }
        }

        // Ejecutar la funcion
        cargarDatos();
    }, []); // Array vacio = ejecutar solo cuando carga el componente

    // Retornar datos y estados
    return {
        data,       // { generos, grupos, canciones }
        loading,    // true/false
        error,      // null o mensaje de error
    };
}

/*
  COMO USAR EN COMPONENTES:
  
  Archivo: ExplorePanel.jsx (componente padre)
  ──────────────────────────────────────────
  import { useExplorar } from "../hooks/useExplorar";
  import GenerosList from "./GenerosList";
  import GruposList from "./GruposList";
  
  export default function ExplorePanel() {
      const { data, loading, error } = useExplorar();
      
      if (loading) return <p>Cargando explorar...</p>;
      if (error) return <p>Error: {error}</p>;
      
      // Pasar GENEROS a su componente
      // Pasar GRUPOS a su componente
      return (
          <div>
              <GenerosList generos={data.generos} />
              <GruposList grupos={data.grupos} />
          </div>
      );
  }
  
  Archivo: GenerosList.jsx
  ───────────────────────
  export default function GenerosList({ generos }) {
      return (
          <div>
              <h2>Generos</h2>
              {generos.map(genero => (
                  <button key={genero.id}>{genero.nombre}</button>
              ))}
          </div>
      );
  }
  
  Archivo: GruposList.jsx
  ──────────────────────
  export default function GruposList({ grupos }) {
      return (
          <div>
              <h2>Grupos</h2>
              {grupos.map(grupo => (
                  <div key={grupo.id}>
                      <h3>{grupo.nombre}</h3>
                      <img src={grupo.imagen} alt={grupo.nombre} />
                  </div>
              ))}
          </div>
      );
  }
  
  RESUMEN:
  1. useExplorar() se llama EN EL COMPONENTE PADRE (ExplorePanel)
  2. El padre obtiene { data, loading, error }
  3. El padre pasa data.generos al GenerosList como <GenerosList generos={data.generos} />
  4. El padre pasa data.grupos al GruposList como <GruposList grupos={data.grupos} />
  5. Los componentes hijos reciben y usan esos datos
*/