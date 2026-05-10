import axiosClient from "./axiosClient";

// =============================
// LISTAR MUSICA
// =============================
export async function listarMusicaApi() {
  const response = await axiosClient.get("/api/musica/listar");
  return response.data;
}

// =============================
// CREAR MUSICA CON AUDIO
// =============================
export async function crearMusicaConAudioApi(datosMusica) {
  const formData = new FormData();

  formData.append("titulo", datosMusica.titulo);
  formData.append("letra", datosMusica.letra || "");
  formData.append("duracion_segundos", datosMusica.duracion_segundos);
  formData.append("grupo_id", datosMusica.grupo_id);
  formData.append("generos_ids", JSON.stringify(datosMusica.generos_ids || []));
  formData.append("audio", datosMusica.audio);

  const response = await axiosClient.post(
    "/api/musica/crear-con-audio",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    }
  );

  return response.data;
}

// =============================
// ELIMINAR MUSICA
// =============================
export async function eliminarMusicaApi(id) {
  const response = await axiosClient.delete(`/api/musica/eliminar/${id}`);
  return response.data;
}