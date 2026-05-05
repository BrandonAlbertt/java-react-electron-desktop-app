import { useCallback, useState } from "react";

import {
    obtenerListasUsuario,
    crearListaUsuario,
    agregarCancionALista,
    quitarCancionDeLista,
    eliminarLista,
} from "../api/listasApi";

/*
|--------------------------------------------------------------------------
| USE LISTAS
|--------------------------------------------------------------------------
| Hook para manejar acciones de listas desde el frontend.
|
| Este hook sirve para:
| - obtener listas de un usuario
| - crear listas
| - agregar canciones a una lista
| - quitar canciones de una lista
| - eliminar listas completas
|
| Aquí SÍ se maneja estado de React.
*/

export function useListas() {
    // ===============================
    // ESTADOS DEL HOOK
    // ===============================
    const [listas, setListas] = useState([]);
    const [loadingListas, setLoadingListas] = useState(false);
    const [errorListas, setErrorListas] = useState(null);

    // ===============================
    // CARGAR LISTAS DEL USUARIO
    // ===============================
    const cargarListas = useCallback(async (usuarioId) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await obtenerListasUsuario(usuarioId);

            setListas(data);
            return data;
        } catch (error) {
            console.error("Error al cargar listas:", error);
            setErrorListas("No se pudieron cargar las listas.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // ===============================
    // CREAR NUEVA LISTA
    // ===============================
    const crearLista = useCallback(async (usuarioId, nuevaLista) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await crearListaUsuario(usuarioId, nuevaLista);

            return data;
        } catch (error) {
            console.error("Error al crear lista:", error);
            setErrorListas("No se pudo crear la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // ===============================
    // AGREGAR CANCIÓN A LISTA
    // ===============================
    const agregarCancion = useCallback(async (listaId, cancionId) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await agregarCancionALista(listaId, cancionId);

            return data;
        } catch (error) {
            console.error("Error al agregar canción a la lista:", error);
            setErrorListas("No se pudo agregar la canción a la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // ===============================
    // QUITAR CANCIÓN DE LISTA
    // ===============================
    const quitarCancion = useCallback(async (listaId, cancionId) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await quitarCancionDeLista(listaId, cancionId);

            return data;
        } catch (error) {
            console.error("Error al quitar canción de la lista:", error);
            setErrorListas("No se pudo quitar la canción de la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // ===============================
    // ELIMINAR LISTA COMPLETA
    // ===============================
    const borrarLista = useCallback(async (listaId) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await eliminarLista(listaId);

            return data;
        } catch (error) {
            console.error("Error al eliminar lista:", error);
            setErrorListas("No se pudo eliminar la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // ===============================
    // RETORNO DEL HOOK
    // ===============================
    return {
        listas,
        setListas,

        loadingListas,
        errorListas,

        cargarListas,
        crearLista,
        agregarCancion,
        quitarCancion,
        borrarLista,
    };
}