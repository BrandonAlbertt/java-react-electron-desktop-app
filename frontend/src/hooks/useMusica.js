import { useState } from "react";
import {
  listarMusicaApi,
  crearMusicaConAudioApi,
  eliminarMusicaApi,
} from "../api/musicaApi";

export function useMusica() {
  const [musicas, setMusicas] = useState([]);
  const [loadingMusica, setLoadingMusica] = useState(false);
  const [errorMusica, setErrorMusica] = useState(null);

  // =============================
  // LISTAR MUSICA
  // =============================
  async function cargarMusica() {
    try {
      setLoadingMusica(true);
      setErrorMusica(null);

      const data = await listarMusicaApi();
      setMusicas(data);

      return data;
    } catch (error) {
      console.error("Error al cargar música:", error);
      setErrorMusica("No se pudo cargar la música");
      throw error;
    } finally {
      setLoadingMusica(false);
    }
  }

  // =============================
  // CREAR MUSICA CON AUDIO
  // =============================
  async function guardarMusica(datosMusica) {
    try {
      setLoadingMusica(true);
      setErrorMusica(null);

      const data = await crearMusicaConAudioApi(datosMusica);

      if (data?.musica) {
        setMusicas((prev) => [data.musica, ...prev]);
      }

      return data;
    } catch (error) {
      console.error("Error al guardar música:", error);
      setErrorMusica("No se pudo guardar la música");
      throw error;
    } finally {
      setLoadingMusica(false);
    }
  }

  // =============================
  // ELIMINAR MUSICA
  // =============================
  async function eliminarMusica(id) {
    try {
      setLoadingMusica(true);
      setErrorMusica(null);

      const data = await eliminarMusicaApi(id);

      setMusicas((prev) => prev.filter((musica) => musica.id !== id));

      return data;
    } catch (error) {
      console.error("Error al eliminar música:", error);
      setErrorMusica("No se pudo eliminar la música");
      throw error;
    } finally {
      setLoadingMusica(false);
    }
  }

  return {
    musicas,
    loadingMusica,
    errorMusica,
    cargarMusica,
    guardarMusica,
    eliminarMusica,
  };
}