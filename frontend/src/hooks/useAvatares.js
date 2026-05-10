import { useEffect, useState } from "react";
import { obtenerAvatar } from "../api/avatarApi";



export function useAvatares() {
    const [avatares, setAvatares] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarAvatares() {
            try {
                const data = await obtenerAvatar();
                setAvatares(data);
            } catch (error) {
                console.error("Error fetching avatares:", error);
            } finally {
                setLoading(false);
            }
        }

        cargarAvatares();
    }, []);

    return { 
        avatares, 
        loading 
    };
}
