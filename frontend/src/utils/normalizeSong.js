export function normalizeSong(raw = {}, grupos = []) {
  const grupoEncontrado = (grupos || []).find((g) => g.nombre === (raw.grupo || raw.groupName));
  const imagenGrupo =
    grupoEncontrado?.imagen_url || raw.imagen_grupo || raw.imagen || raw.imagen_url || raw.groupImage || "";

  const titulo = raw.titulo || raw.title || "";
  const grupo = raw.grupo || raw.groupName || "";
  const link_audio = raw.link_audio || raw.audio || "";
  const duracion_segundos = raw.duracion_segundos || raw.duration || 0;
  const generos = raw.generos || raw.genres || [];
  const letra = raw.letra || raw.lyrics || "";

  return {
    id: raw.id,
    // canonical names used by player components
    titulo,
    grupo,
    link_audio,
    duracion_segundos,
    generos,
    letra,
    imagen_grupo: imagenGrupo,

    // aliases for compatibility
    imagen: imagenGrupo,
    imagen_url: imagenGrupo,
    groupImage: imagenGrupo,
    title: titulo,
    groupName: grupo,
    audio: link_audio,
    duration: duracion_segundos,
    genres: generos,
    lyrics: letra,
  };
}

export default normalizeSong;
