// ===============================
// IMPORTACIONES
// ===============================
import { useCallback, useState } from "react";
import {
    agregarCancionALista,
    crearListaUsuario,
    eliminarLista,
    obtenerListasUsuario,
    quitarCancionDeLista,
    renombrarLista,
} from "../api/listasApi";

/*
  useListas.js

  hook para manejar acciones de listas desde el frontend.
  mantiene estados de carga, errores y listas sin cambiar el contrato actual.
*/

// ===============================
// HOOK PRINCIPAL
// ===============================
export function useListas() {
    // ===============================
    // ESTADOS
    // ===============================
    const [listas, setListas] = useState([]);
    const [loadingListas, setLoadingListas] = useState(false);
    const [errorListas, setErrorListas] = useState(null);

    // ===============================
    // FUNCIONES
    // ===============================
    // carga las listas de un usuario
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

    // crea una lista y la agrega al estado local
    const crearLista = useCallback(async (usuarioId, nombre, urlImagen = null) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const nuevaLista = {
                nombre,
                url_imagen: urlImagen,
            };

            const data = await crearListaUsuario(usuarioId, nuevaLista);
            const listaCreada = data?.lista || data;

            if (listaCreada?.id) {
                setListas((prev) => [...prev, listaCreada]);
            }

            return data;
        } catch (error) {
            console.error("Error al crear lista:", error);
            setErrorListas("No se pudo crear la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // agrega una cancion a una lista
    const agregarCancion = useCallback(async (listaId, cancionId) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await agregarCancionALista(listaId, cancionId);
            return data;
        } catch (error) {
            console.error("Error al agregar cancion a la lista:", error);
            setErrorListas("No se pudo agregar la cancion a la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // quita una cancion de una lista
    const quitarCancion = useCallback(async (listaId, cancionId) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await quitarCancionDeLista(listaId, cancionId);
            return data;
        } catch (error) {
            console.error("Error al quitar cancion de la lista:", error);
            setErrorListas("No se pudo quitar la cancion de la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // elimina una lista completa
    const borrarLista = useCallback(async (listaId) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await eliminarLista(listaId);
            setListas((prev) => prev.filter((lista) => lista.id !== listaId));

            return data;
        } catch (error) {
            console.error("Error al eliminar lista:", error);
            setErrorListas("No se pudo eliminar la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // renombra una lista existente
    const actualizarNombreLista = useCallback(async (listaId, nuevoNombre) => {
        try {
            setLoadingListas(true);
            setErrorListas(null);

            const data = await renombrarLista(listaId, nuevoNombre);

            // actualiza el nombre en el estado local
            setListas((prev) =>
                //el prev es el array de listas actual, lo mapeamos para encontrar la que se renombró y actualizar su nombre
                prev.map((lista) =>
                    // si la lista.id coincide con el id de la lista que renombramos, actualizamos su nombre, sino la dejamos igual
                    lista.id === listaId
                        ? { ...lista, nombre: nuevoNombre } 
                        : lista
                )
            );

            return data;
        } catch (error) {
            console.error("Error al renombrar lista:", error);
            setErrorListas("No se pudo renombrar la lista.");
            return null;
        } finally {
            setLoadingListas(false);
        }
    }, []);

    // ===============================
    // RETORNO
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
        actualizarNombreLista,
    };
}
