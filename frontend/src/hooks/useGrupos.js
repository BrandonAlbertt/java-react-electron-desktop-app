import { useEffect, useState } from "react";
import { agregarGrupos } from "../api/grupoApi";

export function useGrupos() {
    // este const es para guardar los grupos musicales que se muestran en el modal de gestion de musica
    const [grupos, setGrupos] = useState([]);
    // este const es para mostrar un spinner mientras se cargan los grupos musicales
    const [loadingGrupos, setLoadingGrupos] = useState(false);
    // este const es para mostrar un mensaje de error si no se pueden cargar los grupos musicales
    const [errorGrupos, setErrorGrupos] = useState(null);

    // ===============================
    // CREAR GRUPO CON IMAGEN
    // ===============================
    async function guardarGrupo(datosGrupo) {
        try {
            setLoadingGrupos(true);
            setErrorGrupos(null);

            const data = await agregarGrupos(datosGrupo);

            // backend responde { mensaje, grupo }
            if (data?.grupo) {
                setGrupos((prev) => [data.grupo, ...prev]);
            }

            return data;
        } catch (error) {
            console.error("Error al guardar grupo:", error);
            setErrorGrupos("No se pudieron guardar los grupos musicales");
            throw error;
        } finally {
            setLoadingGrupos(false);
        }
    }

    return {
        grupos,
        loadingGrupos,
        errorGrupos,
        guardarGrupo,
    };
}